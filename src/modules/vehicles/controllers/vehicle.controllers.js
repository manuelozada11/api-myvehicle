import { vehicleService } from "../services/index.js";
import { defaultCatcher } from '../../../shared/config/defaultCatcher.js';
import _ from 'lodash';

export const createVehicle = async (req, res) => {
    try {
        const {
            manufacture,
            model,
            ...data
        } = _.pick(req.body, "manufacture", "model", "year", "displacement", "plateNumber", "type", "energyType", "vehicleType", "from", "extId");
        const user = req.user;

        if (!manufacture || !model || !user?._id) return res.status(400).json({ message: 'missing required fields' });

        const result = await vehicleService.createVehicle({ user, manufacture, model, ...data });
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

        const vehicle = await vehicleService.updateVehicle({ userId: _userId, vehicleId: _vehicleId, ...fields });

        return res.status(200).json({ message: 'vehicle updated succesfully', vehicle });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const authorizateTransfer = async (req, res) => {
    try {
        const { _vehicleId } = _.pick(req.params, "_vehicleId");
        const { _id: _userId } = _.pick(req.user, "_id");

        if (_.isEmpty(_userId) || _.isEmpty(_vehicleId)) return res.status(400).json({ message: 'missing required fields' });

        await vehicleService.updateVehicle({ userId: _userId, vehicleId: _vehicleId, isTransferActivated: true });
        setTimeout(async () => {
            await vehicleService.updateVehicle({ userId: _userId, vehicleId: _vehicleId, isTransferActivated: false });
        }, 30000);

        return res.status(200).json({ message: 'transfer activated succesfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const transferVehicle = async (req, res) => {
    try {
        const { _vehicleId } = _.pick(req.params, "_vehicleId");
        const { _id: _userId } = _.pick(req.user, "_id");
        const { lastOwner } = _.pick(req.body, "lastOwner");

        if (_.isEmpty(_userId) || _.isEmpty(_vehicleId) || _.isEmpty(lastOwner)) return res.status(400).json({ message: 'missing required fields' });

        const result = await vehicleService.transferVehicle({ _userId, _vehicleId, lastOwner });

        return res.status(result.code).json({ message: result.message });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const deleteVehicle = async (req, res) => {
    try {
        const { _id } = _.pick(req.params, '_id');

        if (!_id) return res.status(400).json({ message: 'missing required field' });
        const result = await vehicleService.deleteVehicle({ user: req.user, _id });

        return res.status(200).json({ message: 'vehicle deleted successfully' });
    } catch (err) {
        defaultCatcher(err, res);
    }
}

export const getExternalVehicles = async (req, res) => {
    try {
        const { _id } = _.pick(req.user, '_id');
        const { integration } = _.pick(req.params, 'integration');

        if (_.isEmpty(_id)) return res.status(400).json({ message: 'missing user id field' });
        if (_.isEmpty(integration)) return res.status(400).json({ message: 'missing integration name field' });

        const { code, message, payload } = await vehicleService.getExternalVehicles({ userId: _id, integration });

        if (code > 200) return res.status(code).json({ code, message });

        return res.status(code).json({ code, message, payload });
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const connectIntegration = async (req, res) => {
    try {
        const { _id } = _.pick(req.user, '_id');
        const { vehicleId } = _.pick(req.params, 'vehicleId');
        const { integrationName, extId, displacement } = _.pick(req.body, 'integrationName', 'extId', 'displacement');

        if (_.isEmpty(_id)) return res.status(400).json({ message: 'missing user id field' });
        if (_.isEmpty(vehicleId)) return res.status(400).json({ message: 'missing vehicleId field' });
        if (_.isEmpty(integrationName)) return res.status(400).json({ message: 'missing integration name field' });
        if (_.isEmpty(extId)) return res.status(400).json({ message: 'missing extId field' });

        const { code, message } = await vehicleService.connectIntegration({ userId: _id, integrationName, extId, vehicleId, displacement });
        return res.status(code).json({ code, message });
    } catch (e) {
        defaultCatcher(e, res);
    }
}
