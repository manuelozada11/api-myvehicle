import express from "express";
import { checkAuth } from "../../shared/middlewares/checkAuth.js";
import { createVehicle, getVehicle, getVehicles, updateVehicle, deleteVehicle } from "../controllers/vehicle.controllers.js";

const router = express.Router();

router.post('/', createVehicle);
router.get('/', checkAuth, getVehicles);
router.get('/info/:_idVehicle', checkAuth, getVehicle);
router.patch('/usr=:_idUser&vehicle=:_idVehicle', updateVehicle);
router.delete('/:_id', deleteVehicle);

export { router as vehicleRoutes }