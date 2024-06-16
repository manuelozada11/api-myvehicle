import { vehicleRoutes } from "./vehicle.routes.js";
import { checkAuth } from "../../../shared/middlewares/checkAuth.js";

export const createRoutes = (server) => {
    server.use('/v1/vehicles', checkAuth, vehicleRoutes);
}