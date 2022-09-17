import {refuelRoutes} from './refuel.routes.js'

export const createRoutes = (server) => {
    server.use('/v1/refuels', refuelRoutes)
}