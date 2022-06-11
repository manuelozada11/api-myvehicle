import {createRoutes} from './routes/index.js'

export const makeModule = (server) => {
    console.log(`*** creating gas module ***`)
    createRoutes(server)
}