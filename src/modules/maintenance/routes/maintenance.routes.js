import { Router } from "express";
import { createMaintenance, getStatsByVehicle, getMaintenances } from "../controllers/maintenance.controllers.js";

const router = Router();

router
    .post("/:vehicleId", createMaintenance)
    .get("/stats/:vehicleId", getStatsByVehicle)
    .get("/q/:qty/v/:vehicleId", getMaintenances);

export { router as maintenanceRoutes };