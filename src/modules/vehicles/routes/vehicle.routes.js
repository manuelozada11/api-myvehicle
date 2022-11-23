import express from "express";
import { createVehicle, getVehicle, getVehicleInfo, getVehicles, updateVehicle, deleteVehicle } from "../controllers/vehicle.controllers.js";

const router = express.Router();

router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/details/:_idVehicle', getVehicle);
router.get('/info/:_idVehicle', getVehicleInfo);
router.patch('/usr=:_idUser&vehicle=:_idVehicle', updateVehicle);
router.delete('/:_id', deleteVehicle);

export { router as vehicleRoutes }