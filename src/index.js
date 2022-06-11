import 'dotenv/config'
// import '../database.js'
import {setupServer, startServer} from './modules/shared/server.js'
import {makeGasModule} from './modules/index.js'

const main = () => {
    const server = setupServer()

    makeGasModule(server)
    
    startServer(server)
}

main()