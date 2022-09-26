import 'dotenv/config'
import { setupServer, startServer } from './src/modules/shared/infra/http/server.js';
import { makeMaintenanceModule, makeUsersModule, makeVehicleModule } from './src/modules/index.js';
import { varValidates } from './src/modules/shared/config/validation.js';
import { dbConnect } from './src/modules/shared/infra/database/database.js';
import { defaultCatcher } from './src/modules/shared/config/defaultCatcher.js';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampler: 1.0
});

try {
    varValidates();
    const server = setupServer();

    makeMaintenanceModule(server);
    makeUsersModule(server);
    makeVehicleModule(server);
    await dbConnect();
    
    startServer(server);
} catch (e) {
    defaultCatcher(e);
    process.exit(0);
}