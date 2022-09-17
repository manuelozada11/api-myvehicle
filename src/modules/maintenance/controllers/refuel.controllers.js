import _ from 'lodash';
import { refuelService } from '../services/index.js';
import { defaultCatcher } from '../../shared/config/defaultCatcher.js';
import { vehicleService } from '../../vehicles/services/index.js';

export const createRefuel = async (req, res) => {
    try {
        const {
            date,
            fuel,
            amount,
            quantity,
            gasStation
        } = _.pick(req.body, "date", "fuel", "amount", "quantity", "gasStation", "vehicle");
        const { _id, name, lastname } = _.pick(req.user, "_id", "name", "lastname");
        const { _idVehicle } = _.pick(req.params, "_idVehicle");
        
        if (!_.isNumber(fuel) || !_.isNumber(amount) || !_.isNumber(quantity) || _.isEmpty(_idVehicle)) return res.status(400).json({ error: 'missing required fields' });

        const vehicleResp = await vehicleService.getVehicleBydId({ _idUser: _id, _idVehicle });

        if (!vehicleResp) return res.status(400).json({ error: 'vehicle not found' });
        
        const user = {
            _id,
            fullname: `${ name } ${ lastname }`
        }

        const vehicle = {
            _id: _idVehicle,
            fullname: `${ vehicle.manufacture } ${ vehicle.model }`           
        }

        await refuelService.createRefuel({ date, fuel, amount, quantity, gasStation, user, vehicle });

        return res.status(200).json({ message: 'created successfully' })
    } catch (e) {
        defaultCatcher(e, res)
    }
}

export const getRefuel = async (req, res) => {
    try {
        const { _idRefuel } = _.pick(req.params, "_idRefuel");
        const { _id } = _.pick(req.user, "_id");

        if (!_idRefuel) return res.status(400).json({ error: 'MISSING_REFUELID_FIELD' });
        if (!_id) return res.status(400).json({ error: 'MISSING_USERID_FIELD' });

        const refuel = await refuelService.getRefuel({ _id, _idRefuel });
        if (!refuel) return res.status(400).json({ code: 404, message: 'REFUEL_NOT_FOUND' });

        return res.status(200).json({ message: 'REFUEL_FOUND', refuel: refuel })
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const getRefuels = async (req, res) => {
    try {
        const { _id } = _.pick(req.user, "_id");

        if (!_id) return res.status(400).json({ code: 400, message: 'MISSING_USERID_FIELD' });

        const refuels = await refuelService.getRefuelsByUser({ userId: _id });
        
        if (!refuels.length) return res.status(400).json({ code: 404, message: 'REFUELS_NOT_FOUND' });

        return res.status(200).json({ code: 200, payload: refuels })
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const updateRefuel = async (req, res) => {
    try {
        const { _id } = _.pick(req.params);
        const { date, fuel, amount, quantity, displacement, gasStation, user, vehicle } = _.pick(req.body, ["date", "fuel", "amount", "quantity", "displacement", "gasStation", "user", "vehicle"]);

        if (!_.isEmpty(_id)) return res.status(400).json({ error: 'missing required fields' });

        console.log(date, fuel, amount, quantity, displacement, gasStation, user, vehicle);
        // const refuel = await refuelService.updateRefuel(_id, date, fuel, amount, quantity, gasStation, location);

        res.status(200).json({ message: 'updated successfully' })
        // res.status(200).json({ message: 'updated successfully', refuel: refuel })
    } catch (err) {
        console.log(err)
        res.status(err.code).json({message: err.message})
    }
}

export const deleteRefuel = async (req, res) => {
    try {
        const { _id } = req.params

        if (!_id) return res.status(400).json({ error: 'missing id field' });

        await refuelService.deleteRefuel(_id);

        res.status(200).json({ message: 'deleted successfully' })
    } catch (err) {
        console.log(err)
        res.status(err.code).json({message: err.message})
    }
}