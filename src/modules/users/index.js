import {createRoutes} from './routes/index.js';

export const makeModule = (server) => {
    if (process.env.NODE_ENV !== 'production') console.log('😎  >> creating user module');
    createRoutes(server);
}