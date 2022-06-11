import morgan from 'morgan'
import cors from 'cors'
import express from 'express'

export const setupServer = () => {
    try {
        console.log(`setting up server...`);
        const app = express()
            .set('port', process.env.SERVER_PORT ?? 5001)
            .use(cors())
            .use(morgan('dev'))
            .use(express.json())
        
        return app
    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

export const startServer = (server) => {
    try {
        // open server
        server.listen(server.get('port'), () => console.log(`Server running on port ${server.get('port')} 💥`))
    } catch (err) {
        console.log(err)
        return { error: err }
    }
}