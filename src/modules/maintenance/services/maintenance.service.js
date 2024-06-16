import { vehicleService } from '../../vehicles/services/index.js';

export const makeService = (MaintenanceModel) => {
    const createMaintenance = async ({ vehicleId, user, ...fields }) => {
        const { _id, name, lastname } = user;
        const vehicleResp = await vehicleService.getVehicleById({ _idUser: _id, _idVehicle: vehicleId });

        if (!vehicleResp) return { result: 404, response: 'vehicle not found' };
        
        const newUser = { _id, fullname: `${ name } ${ lastname }` };
        const vehicle = { _id: vehicleId, fullname: `${ vehicleResp.manufacture } ${ vehicleResp.model }` };

        await MaintenanceModel.create({ user: newUser, vehicle, ...fields });
        return { result: 200, response: 'maintenance created successfully' };
    }
    
    const getMaintenanceById = ({ maintenanceId }) => {}
    
    const getAllMaintenancesById = async ({ vehicleId, user, qty }) => {
        const result = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "user._id": user._id }, { "createdAt": -1 }, qty);
        
        if (result.length === 0) return { result: 404, response: "no maintenances found", payload: null };
        return { result: 200, response: "maintenances found", payload: result };
    }
    
    const getStatsByVehicle = async ({ vehicleId }) => {
        let response = {};

        const thisYear = new Date();
        thisYear.setMonth(0);
        thisYear.setDate(1);
        thisYear.setHours(0,0,0);

        const quantity = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "createdAt": { "$gte": new Date(thisYear) } });
        response.quantity = quantity.length;
        
        const battery = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "type": "battery" });
        if (battery.length > 0) response.batteryDate = battery[0].createdAt;
        
        const tires = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "type": "battery" });
        if (tires.length > 0) response.tiresDate = tires[0].createdAt;
        
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0,0,0);
        const spent = await MaintenanceModel.getMaintenances({ "vehicle._id": vehicleId, "createdAt": { "$gte": new Date(thisMonth) } });
        let amount = 0;
        spent.forEach(element => {
            amount += element.amount;
        });
        response.spentMonthly = Number(amount.toFixed(2));

        const lastMaintenance = await MaintenanceModel.getMaintenancesLimit({ "vehicle._id": vehicleId }, { "createdAt": -1 }, 1);
        if (lastMaintenance.length > 0) {
            response.lastMaintenanceDate = lastMaintenance[0].createdAt;
            const nextMaintYear = new Date(lastMaintenance[0].createdAt).getFullYear() + 1;
            const nextMaintDate = new Date(new Date().setFullYear(nextMaintYear));
            response.nextMaintenanceDate = nextMaintDate;
        }

        if (lastMaintenance.length === 0) return { result: 404, response: "no maintenances found", stats: null };

        return { 
            result: 200,
            response: "maintenances found",
            stats: response
        };
    }

    const updateMaintenance = (fields) => {}
    
    const deleteMaintenance = ({ maintenanceId }) => {}

    return {
        createMaintenance,
        getMaintenanceById,
        getAllMaintenancesById,
        getStatsByVehicle,
        updateMaintenance,
        deleteMaintenance
    }
}