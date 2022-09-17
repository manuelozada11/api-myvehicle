import { vehicleRoutes } from "./vehicle.routes.js";

export const createRoutes = (server) => {
    server.use('/v1/vehicles', vehicleRoutes);
}