import express from "express";
import { createVehicle, getVehicle, getVehicleInfo, getVehicles, updateVehicle, deleteVehicle, transferVehicle, authorizateTransfer } from "../controllers/vehicle.controllers.js";

const router = express.Router();

router
    .post('/', createVehicle)
    .post('/transfer/:_vehicleId', authorizateTransfer)
    .get('/', getVehicles)
    .get('/details/:_idVehicle', getVehicle)
    .get('/info/:_idVehicle', getVehicleInfo)
    .patch('/:_vehicleId', updateVehicle)
    .patch('/transfer/:_vehicleId', transferVehicle)
    .delete('/:_id', deleteVehicle);

export { router as vehicleRoutes }