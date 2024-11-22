import _ from "lodash";
import { validateCreateFields } from "../maintenance.utils.js";
import { defaultCatcher } from '../../../shared/config/defaultCatcher.js';
import { maintenanceService } from '../../maintenance/services/maintenance.service.js';

export const createMaintenance = async (req, res) => {
  try {
    const fields = _.pick(req.body,
      "type", "description", "date", "adjustments", "private", "kms", "amount");

    const user = _.pick(req.user, "_id", "name", "lastname");
    const { vehicleId } = _.pick(req.params, "vehicleId");

    const { code, message } = validateCreateFields({ user, vehicleId, ...fields });
    if (code > 0) return res.status(code).json({ code, message });

    const { result, response } = await maintenanceService.createMaintenance({ user, vehicleId, ...fields });
    return res.status(result).json({ code: result, message: response });
  } catch (e) {
    defaultCatcher(e, res)
  }
}

export const getStatsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = _.pick(req.params, "vehicleId");
    const user = _.pick(req.user, "_id");

    if (!vehicleId) return res.status(400).json({ code: 400, message: "missing vehicleId field" });

    const { result, response, stats } = await maintenanceService.getStatsByVehicle({ vehicleId, userId: user._id});

    return res.status(result).json({ code: result, message: response, stats });
  } catch (e) {
    defaultCatcher(e, res)
  }
}

export const getMaintenances = async (req, res) => {
  try {
    const user = _.pick(req.user, "_id", "name", "lastname");
    const { vehicleId, qty } = _.pick(req.params, "vehicleId", "qty");

    if (!vehicleId) return res.status(400).json({ code: 400, message: "missing vehicleId field" });
    if (!user) return res.status(400).json({ code: 400, message: "missing user field" });

    const { result, response, payload } = await maintenanceService.getAllMaintenancesById({ vehicleId, user, qty: Number(qty) });
    if (result > 200) return res.status(result).json({ code: result, message: response });
    return res.status(result).json({ code: result, message: response, payload });
  } catch (e) {
    defaultCatcher(e, res)
  }
}

export const getMaintenanceById = async (req, res) => {
  try {
    const user = _.pick(req.user, "_id", "name", "lastname");
    const { vehicleId, maintenanceId } = _.pick(req.params, "vehicleId", "maintenanceId");

    if (!vehicleId) return res.status(400).json({ code: 400, message: "missing vehicleId field" });
    if (!maintenanceId) return res.status(400).json({ code: 400, message: "missing maintenanceId field" });

    const { result, response, payload } = await maintenanceService.getMaintenanceById({ vehicleId, user, maintenanceId });
    if (result > 200) return res.status(result).json({ code: result, message: response });
    return res.status(result).json({ code: result, message: response, payload });
  } catch (e) {
    defaultCatcher(e, res)
  }
}