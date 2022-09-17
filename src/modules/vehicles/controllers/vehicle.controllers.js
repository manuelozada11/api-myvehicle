import { vehicleService } from "../services/index.js";
import { defaultCatcher } from '../../shared/config/defaultCatcher.js';
import { customError } from '../../shared/config/customError.js';
import _ from 'lodash';

export const createVehicle = async (req, res) => {
    try {
        const { manufacture, model, year, displacement, user, plateNumber, type, energyType } = req.body;
    
        if (!manufacture || !model || !type || !energyType || !user?._id) return res.status(400).json({ message: 'missing required fields' });
    
        const result = await vehicleService.createVehicle(manufacture, model, year, displacement, plateNumber, user, type, energyType);
        if (result.error) return res.status(500).json({ message: result.error });
        
        return res.status(200).json({ message: 'vehicle created successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const getVehicle = async (req, res) => {
    try {
        const { _idUser, _idVehicle } = req.params;
        
        if (!_idVehicle || !_idUser) return res.status(400).json({ message: 'missing required fields' });
        
        const vehicle = await vehicleService.getVehiclesByUser(_idUser, _idVehicle);
        if (vehicle?.length === 0) return res.status(404).json({ message: 'vehicle not found' });

        return res.status(200).json({ message: 'vehicle found', payload: vehicle });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const getVehicles = async (req, res) => {
    try {
        const { _id } = _.pick(req.user, '_id');
        
        if (!_id) return res.status(400).json({ code: 400, message: 'MISSING_REQUIRED_FIELD' });
        const vehicles = await vehicleService.getVehiclesByUser({ _id });

        if (!vehicles.length) return res.status(404).json({ code: 404, message: 'VEHICLE_NOT_FOUND' });

        return res.status(200).json({ code: 200, payload: vehicles });
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const updateVehicle = async (req, res) => {
    try {
        const { _idUser, _idVehicle } = req.params;
        const { brand, model, year, km, plateNumber } = req.body;

        if (!_idUser || !_idVehicle) return res.status(400).json({ message: 'missing required field' });
        const vehicle = await vehicleService.updateVehicle(_idUser, _idVehicle, brand, model, year, km, plateNumber);
        console.log(vehicle);

        return res.status(200).json({ message: 'vehicles updated succesfully', payload: vehicle });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const deleteVehicle = async (req, res) => {
    try {
        const { _id } = req.params;

        if (!_id) return res.status(400).json({ message: 'missing required field' });
        const result = await vehicleService.deleteVehicle(_id);
        console.log(result);

        return res.status(200).json({ message: 'vehicle deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}