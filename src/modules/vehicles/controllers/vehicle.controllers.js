import { vehicleService } from "../services/index.js";
import { defaultCatcher } from '../../shared/config/defaultCatcher.js';
import _ from 'lodash';

export const createVehicle = async (req, res) => {
    try {
        const { 
            manufacture, 
            model, 
            year, 
            displacement, 
            plateNumber, 
            type, 
            energyType 
        } = _.pick(req.body, "manufacture", "model", "year", "displacement", "plateNumber", "type", "energyType");
        const { _id } = _.pick(req.user, "_id");
    
        if (!manufacture || !model || !type || !energyType || !_id) return res.status(400).json({ message: 'missing required fields' });

        const result = await vehicleService.createVehicle({ manufacture, model, year, displacement, plateNumber, user: { _id }, type, energyType });
        if (result.error) return res.status(500).json({ message: result.error });
        
        return res.status(200).json({ message: 'vehicle created successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const getVehicle = async (req, res) => {
    try {
        const { _idVehicle } = _.pick(req.params, '_idVehicle');
        const { _id } = _.pick(req.user, '_id');
        
        if (!_idVehicle || !_id) return res.status(400).json({ message: 'missing required fields' });
        
        const vehicle = await vehicleService.getVehicleById({ _idUser: _id, _idVehicle });
        if (vehicle?.length === 0) return res.status(404).json({ message: 'vehicle not found' });

        return res.status(200).json({ message: 'vehicle found', payload: vehicle });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const getVehicleInfo = async (req, res) => {
    try {
        const { _idVehicle } = _.pick(req.params, '_idVehicle');
        const { _id } = _.pick(req.user, '_id');
        
        if (!_idVehicle || !_id) return res.status(400).json({ message: 'missing required fields' });
        
        const vehicle = await vehicleService.getVehicleInfoById({ _idUser: _id, _idVehicle });
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
        
        if (!_id) return res.status(400).json({ message: 'MISSING_REQUIRED_FIELD' });
        const vehicles = await vehicleService.getVehiclesByUser({ _id });

        if (!vehicles.length) return res.status(404).json({ message: 'VEHICLE_NOT_FOUND' });

        return res.status(200).json({ payload: vehicles });
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const updateVehicle = async (req, res) => {
    try {
        const { _vehicleId } = _.pick(req.params, "_vehicleId");
        const { _id: _userId } = _.pick(req.user, "_id");
        const fields = _.pick(req.body, 
            "bodySerial", "boughtDate", "color",
            "displacement", "energyType", "insuranceDate",
            "manufacture", "model", "passengers",
            "plateNumber", "taxesDate", "vehicleType", "year");

        if (_.isEmpty(_userId) || _.isEmpty(_vehicleId)) return res.status(400).json({ message: 'missing required fields' });

        const vehicle = await vehicleService.updateVehicle({ _userId, _vehicleId, ...fields });

        return res.status(200).json({ message: 'vehicle updated succesfully', vehicle });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const deleteVehicle = async (req, res) => {
    try {
        const { _id } = _.pick(req.params, '_id');
        
        if (!_id) return res.status(400).json({ message: 'missing required field' });
        const result = await vehicleService.deleteVehicle({ _id });
        console.log(result);

        return res.status(200).json({ message: 'vehicle deleted successfully' });
    } catch (err) {
        defaultCatcher(e, res);
    }
}