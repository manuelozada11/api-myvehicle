import 'dotenv/config'
import {setupServer, startServer} from './modules/shared/server.js'
import {makeMaintenanceModule, makeUsersModule} from './modules/index.js'
import { varValidates } from './modules/config/validation.js'
import { dbConnect } from './modules/shared/database.js'

try {
    varValidates()
    const server = setupServer()

    makeMaintenanceModule(server)
    makeUsersModule(server)
    await dbConnect()
    
    startServer(server)
} catch (err) {
    console.error(err)
    process.exit(0)
}