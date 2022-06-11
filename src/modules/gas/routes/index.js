import {refuelRoutes} from './refuel.routes.js'

export const createRoutes = (server) => {
    console.log(`creating module routes...`);
    server.use('/api/v1/refuel', refuelRoutes)
}