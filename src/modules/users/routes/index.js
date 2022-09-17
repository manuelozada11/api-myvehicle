import { userRoutes } from './user.routes.js';

export const createRoutes = (server) => {
    server.use('/v1/users', userRoutes)
}