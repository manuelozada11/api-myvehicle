import express from "express";
import { createVehicle, getVehicle, getVehicleInfo, getVehicles, updateVehicle, deleteVehicle, transferVehicle, authorizateTransfer, getExternalVehicles, connectIntegration, getVehicleLimits, updateVehicleSettings, getMaintenanceStatus } from "../controllers/vehicle.controllers.js";

const router = express.Router();

router
    .post('/transfer/:_vehicleId', authorizateTransfer)
    .post('/externals/:vehicleId', connectIntegration) // Connect external vehicle integration
    .post('/', createVehicle);

router
    .get('/', getVehicles)
    .get('/limits', getVehicleLimits)
    .get('/details/:_idVehicle', getVehicle)
    .get('/info/:_idVehicle', getVehicleInfo)
    .get('/externals/:integration', getExternalVehicles)
    .get('/:_id/maintenance-status', getMaintenanceStatus);

router
    .patch('/:_vehicleId', updateVehicle)
    .patch('/transfer/:_vehicleId', transferVehicle)
    .patch('/:_id/settings', updateVehicleSettings);

router
    .delete('/:_id', deleteVehicle);

export { router as vehicleRoutes }