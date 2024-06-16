import { checkAuth } from "../../../shared/middlewares/checkAuth.js";
import { maintenanceRoutes } from "./maintenance.routes.js";
import { refuelRoutes } from './refuel.routes.js'

export const createRoutes = (server) => {
    server.use('/v1/refuels', checkAuth, refuelRoutes);
    server.use('/v1/maintenances', checkAuth, maintenanceRoutes);
}