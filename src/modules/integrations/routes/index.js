import { stravaRoutes } from './strava.routes.js';

export const createRoutes = (server) => {
    server.use('/v1/strava', stravaRoutes)
}