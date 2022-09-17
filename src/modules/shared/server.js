import morgan from 'morgan'
import cors from 'cors'
import express from 'express'

export const setupServer = () => {
    console.log(`setting up server...`);
    const app = express()
        .set('port', process.env.SERVER_PORT ?? 5001)
        .use(cors())
        .use(morgan('dev'))
        .use(express.json())
    
    return app
}

export const startServer = (server) => {
    // open server
    server.listen(server.get('port'), () => console.log(`Server running on port ${server.get('port')} 💥\n`))
}