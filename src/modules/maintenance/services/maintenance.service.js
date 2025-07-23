import { vehicleService } from '../../vehicles/services/vehicle.services.js';
import { MaintenanceModel } from '../models/index.js'
import { makeMaintenanceRepository } from '../repositories/index.js'
import { userService } from '../../users/services/user.service.js';
import { notificationConstants } from '../../../shared/constants/notifications.constants.js';
import { MAINTENANCE_TYPE_LABELS } from '../../../shared/constants/maintenance.constants.js';

export const makeService = (MaintenanceModel) => {
  const createMaintenance = async ({ vehicleId, user, ...fields }) => {
    const { _id, name, lastname } = user;
    const vehicleResp = await vehicleService.getVehicleById({ _idUser: _id, _idVehicle: vehicleId });

    if (!vehicleResp) return { result: 404, response: 'vehicle not found' };

    const owner = { _id, fullname: `${name} ${lastname}` };
    const vehicle = { _id: vehicleId, fullname: `${vehicleResp.manufacture} ${vehicleResp.model}` };

    if (fields?.kms) {
      await vehicleService.updateVehicle({
        userId: user._id,
        vehicleId: vehicleId,
        displacement: fields.kms
      });
    }
    else {
      fields.kms = vehicleResp?.displacement;
    }

    // Check if this maintenance type should reset the accumulated kilometers
    const vehicleSettings = vehicleResp.settings || {};
    const resetMaintenanceType = vehicleSettings.resetMaintenanceType || '';
    let didReset = false;
    if (fields.adjustments?.includes(resetMaintenanceType)) {
      // Reset accumulated kilometers
      await vehicleService.updateVehicleMaintenance({
        userId: user._id,
        vehicleId: vehicleId,
        maintenance: {
          accumulatedKm: 0
        }
      });
      didReset = true;
    }

    await MaintenanceModel.create({ user: owner, vehicle, ...fields });

    // Notificación de reset acumulado
    if (didReset) {
      // Obtener idioma del usuario
      const userDoc = await userService.getUserById({ _id: user._id });
      const lang = userDoc?.language === 'es' ? 'es' : 'en';
      const notif = notificationConstants.find(n => n.notificationId === 3);
      const maintenanceLabel = MAINTENANCE_TYPE_LABELS[lang][resetMaintenanceType] || resetMaintenanceType;
      let message = notif.message[lang]
        .replace('{vehicle}', vehicle.fullname)
        .replace('{maintenanceType}', maintenanceLabel);
      await userService.addNotification({ _id: user._id, message });
    }
    return { result: 200, response: 'maintenance created successfully' };
  }

  const getMaintenanceById = async ({ user, vehicleId, maintenanceId }) => {
    const maintenance = await MaintenanceModel.getMaintenances({ "user._id": user._id, "vehicle._id": vehicleId, _id: maintenanceId });
    if (!maintenance) return { result: 404, response: 'maintenance not found', payload: null };

    return { result: 200, response: "maintenance found", payload: maintenance }
  }

  const getAllMaintenancesById = async ({ vehicleId, user, qty }) => {
    const result = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "user._id": user._id }, { "date": -1 }, qty);

    if (result.length === 0) return { result: 404, response: "no maintenances found", payload: null };
    return { result: 200, response: "maintenances found", payload: result };
  }

  const getStatsByVehicle = async ({ vehicleId, userId }) => {
    const response = {};

    // Calcular fechas de inicio de año y mes actuales solo una vez
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);

    // Ejecutar todas las consultas en paralelo para optimizar tiempos
    const [
      quantityMaintenances,
      [batteryMaintenance],
      [tiresMaintenance],
      [lastMaintenance]
    ] = await Promise.all([
      MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "user._id": userId, "date": { "$gte": startOfYear } }, { "date": -1 }),
      MaintenanceModel.getMaintenancesLimit({ "vehicle._id": vehicleId, "user._id": userId, "type": "battery" }, { "date": -1 }, 1),
      MaintenanceModel.getMaintenancesLimit({ "vehicle._id": vehicleId, "user._id": userId, "type": "tires" }, { "date": -1 }, 1),
      MaintenanceModel.getMaintenancesLimit({ "vehicle._id": vehicleId }, { "date": -1 }, 1)
    ]);

    // Cantidad de mantenimientos este año
    response.quantity = quantityMaintenances.length;

    // Última fecha de batería y llantas
    if (batteryMaintenance) response.batteryDate = batteryMaintenance.date;
    if (tiresMaintenance) response.tiresDate = tiresMaintenance.date;

    // Calcular gasto mensual
    response.spentMonthly = Number(
      quantityMaintenances.reduce((acc, el) => {
        const date = new Date(el.date);
        if (el?.amount > 0 && date >= startOfMonth) {
          return acc + el.amount;
        }
        return acc;
      }, 0).toFixed(2)
    );

    // Último mantenimiento y próximo mantenimiento
    if (!lastMaintenance) return { result: 404, response: "no maintenances found", stats: null }; 
      response.lastMaintenanceDate = lastMaintenance.date;
      const lastDate = new Date(lastMaintenance.date);
      const nextMaintDate = new Date(lastDate);
      nextMaintDate.setFullYear(lastDate.getFullYear() + 1);
      response.nextMaintenanceDate = nextMaintDate;

    return {
      result: 200,
      response: "maintenances found",
      stats: response
    };
  }

  const deleteMaintenanceById = async (maintenanceId) => {
    const maintenance = await MaintenanceModel.deleteById(maintenanceId);
    if (!maintenance) return { result: 404, response: 'maintenance not found' };

    return { result: 200, response: 'maintenance deleted successfully' };
  }

  const deleteMaintenance = async ({ userId, vehicleId }) => {
    const maintenance = await MaintenanceModel.deleteBy({ userId, vehicleId });
    if (!maintenance) return { result: 404, response: 'maintenance not found' };

    return { result: 200, response: 'maintenance deleted successfully' };
  }

  return {
    createMaintenance,
    getMaintenanceById,
    getAllMaintenancesById,
    getStatsByVehicle,
    deleteMaintenanceById,
    deleteMaintenance
  }
}

export const maintenanceService = makeService({ ...makeMaintenanceRepository(MaintenanceModel) });