import { vehicleService } from '../../vehicles/services/index.js';
import { MaintenanceModel } from '../models/index.js'
import { makeMaintenanceRepository } from '../repositories/index.js'

export const makeService = (MaintenanceModel) => {
  const createMaintenance = async ({ vehicleId, user, ...fields }) => {
    const { _id, name, lastname } = user;
    const vehicleResp = await vehicleService.getVehicleById({ _idUser: _id, _idVehicle: vehicleId });

    if (!vehicleResp) return { result: 404, response: 'vehicle not found' };

    const owner = { _id, fullname: `${name} ${lastname}` };
    const vehicle = { _id: vehicleId, fullname: `${vehicleResp.manufacture} ${vehicleResp.model}` };

    if (fields?.kms) {
      vehicleService.updateVehicle({
          _userId: user._id, 
          _vehicleId: vehicleId, 
          displacement: fields.kms
      });
  }

    await MaintenanceModel.create({ user: owner, vehicle, ...fields });
    return { result: 200, response: 'maintenance created successfully' };
  }

  const getMaintenanceById = async ({ user, vehicleId, maintenanceId }) => {
    const maintenance = await MaintenanceModel.getMaintenances({ "user._id": user._id, "vehicle._id": vehicleId, _id: maintenanceId });
    if (!maintenance) return { result: 404, response: 'maintenance not found', payload: null };

    return { result: 200, response: "maintenance found", payload: maintenance}
  }

  const getAllMaintenancesById = async ({ vehicleId, user, qty }) => {
    const result = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "user._id": user._id }, { "createdAt": -1 }, qty);

    if (result.length === 0) return { result: 404, response: "no maintenances found", payload: null };
    return { result: 200, response: "maintenances found", payload: result };
  }

  const getStatsByVehicle = async ({ vehicleId, userId }) => {
    let response = {};

    const thisYear = new Date();
    thisYear.setMonth(0);
    thisYear.setDate(1);
    thisYear.setHours(0, 0, 0);

    const quantity = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "user._id": userId, "createdAt": { "$gte": new Date(thisYear) } });
    response.quantity = quantity.length;
    
    const battery = await MaintenanceModel.getMaintenancesLimit({ "vehicle._id": vehicleId, "user._id": userId, "type": "battery" }, { "createdAt": -1 }, 1);
    if (battery.length > 0) response.batteryDate = battery[0].createdAt;

    const tires = await MaintenanceModel.getMaintenancesLimit({ "vehicle._id": vehicleId, "user._id": userId, "type": "battery" }, { "createdAt": -1 }, 1);
    if (tires.length > 0) response.tiresDate = tires[0].createdAt;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0);
    let amount = 0;
    quantity.forEach(element => {
      const date = new Date(element.createdAt).getTime();
      if (element?.amount > 0 && date > thisMonth.getTime()) amount += element.amount;
    });
    response.spentMonthly = Number(amount.toFixed(2));
    
    const lastMaintenance = await MaintenanceModel.getMaintenancesLimit({ "vehicle._id": vehicleId }, { "createdAt": -1 }, 1);
    if (lastMaintenance.length > 0) {
      response.lastMaintenanceDate = lastMaintenance[0].createdAt;
      const nextMaintYear = new Date(lastMaintenance[0].createdAt).getFullYear() + 1;
      const nextMaintDate = new Date(new Date().setFullYear(nextMaintYear));
      response.nextMaintenanceDate = nextMaintDate;
    }
    // console.log("lastMaintenance", lastMaintenance)
    if (lastMaintenance.length === 0) return { result: 404, response: "no maintenances found", stats: null };

    return {
      result: 200,
      response: "maintenances found",
      stats: response
    };
  }

  const deleteMaintenance = async (filter) => {
    const maintenance = await MaintenanceModel.getMaintenances({ "vehicle._id": filter?.vehicleId, "user._id": filter?.userId });
    if (!maintenance) return { result: 404, response: 'maintenance not found' };

    await MaintenanceModel.deleteBy({ "vehicle._id": filter?.vehicleId, "user._id": filter?.userId });
    return { result: 200, response: 'maintenance deleted successfully' };
  }

  return {
    createMaintenance,
    getMaintenanceById,
    getAllMaintenancesById,
    getStatsByVehicle,
    deleteMaintenance
  }
}

export const maintenanceService = makeService({...makeMaintenanceRepository(MaintenanceModel)});