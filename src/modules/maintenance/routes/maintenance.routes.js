import { Router } from "express";
import { createMaintenance, getStatsByVehicle } from "../controllers/maintenance.controllers.js";

const router = Router();

router
    .post("/:vehicleId", createMaintenance)
    .get("/stats/:vehicleId", getStatsByVehicle);

export { router as maintenanceRoutes };