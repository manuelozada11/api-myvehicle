import express from "express";
import { createVehicle, getVehicle, getVehicleInfo, getVehicles, updateVehicle, deleteVehicle, transferVehicle, authorizateTransfer, getExternalVehicles, connectIntegration } from "../controllers/vehicle.controllers.js";

const router = express.Router();

router
    .post('/transfer/:_vehicleId', authorizateTransfer)
    .post('/externals/:vehicleId', connectIntegration) // Connect external vehicle integration
    .post('/', createVehicle);

router
    .get('/', getVehicles)
    .get('/details/:_idVehicle', getVehicle)
    .get('/info/:_idVehicle', getVehicleInfo)
    .get('/externals/:integration', getExternalVehicles);

router
    .patch('/:_vehicleId', updateVehicle)
    .patch('/transfer/:_vehicleId', transferVehicle);

router
    .delete('/:_id', deleteVehicle);

export { router as vehicleRoutes }