import {refuelRoutes} from './refuel.routes.js'

export const createRoutes = (server) => {
    server.use('/api/v1/refuel', refuelRoutes)
}