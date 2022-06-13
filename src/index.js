import 'dotenv/config'
import {setupServer, startServer} from './modules/shared/server.js'
import {makeGasModule} from './modules/index.js'
import { varValidates } from './modules/config/validation.js'
import { dbConnect } from './modules/shared/database.js'

const main = async () => {
    try {
        varValidates()
        const server = setupServer()

        makeGasModule(server)
        await dbConnect()
        
        startServer(server)
    } catch (err) {
        console.error(err)
        process.exit(0)
    }
}

main()