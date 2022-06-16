import { userRoutes } from './user.routes.js';

export const createRoutes = (server) => {
    server.use('/api/v1/users', userRoutes)
}