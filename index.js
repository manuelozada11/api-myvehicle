import 'dotenv/config'
import { setupServer, startServer } from './src/modules/shared/server.js';
import { makeMaintenanceModule, makeUsersModule, makeVehicleModule } from './src/modules/index.js';
import { varValidates } from './src/modules/shared/config/validation.js';
import { dbConnect } from './src/modules/shared/database.js';
import { defaultCatcher } from './src/modules/shared/config/defaultCatcher.js';

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