import { carRoutes } from "./car.routes.js";

export const createRoutes = (server) => {
    server.use('/api/v1/cars', carRoutes);
}