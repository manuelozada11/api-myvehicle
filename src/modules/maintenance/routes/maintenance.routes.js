import { Router } from "express";
import { createMaintenance, getStatsByVehicle, getMaintenances, getMaintenanceById, deleteMaintenanceById } from "../controllers/maintenance.controllers.js";

const router = Router();

router
    .post("/:vehicleId", createMaintenance)
    .get("/stats/:vehicleId", getStatsByVehicle)
    .get("/q/:qty/v/:vehicleId", getMaintenances)
    .get('/detail/:vehicleId/:maintenanceId', getMaintenanceById)
    .delete('/:maintenanceId', deleteMaintenanceById);

export { router as maintenanceRoutes };