import { refuelService } from '../services/index.js';
import { defaultCatcher } from '../../shared/config/defaultCatcher.js';
import _ from 'lodash';

export const createRefuel = async (req, res) => {
    try {
        const { date, fuel, amount, quantity, gasStation, user, vehicle } = req.body;

        if (!fuel || !amount || !quantity || !user || !user?._id || !user?.fullname || !vehicle?._id || !vehicle?.fullname) return res.status(400).json({ error: 'missing required fields' });

        await refuelService.createRefuel(date, fuel, amount, quantity, gasStation, user, vehicle);

        res.status(200).json({ message: 'created successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

export const getRefuel = async (req, res) => {
    try {
        const { _id } = req.params

        if (!_id) return res.status(400).json({ error: 'missing id field' });

        const refuel = await refuelService.getRefuel(_id);

        res.status(200).json({ message: 'connection success', refuel: refuel })
    } catch (err) {
        console.log(err)
        res.status(err.code).json({message: err.message})
    }
}

export const getRefuels = async (req, res) => {
    try {
        const { _id } = req.user;

        if (!_id) return res.status(400).json({ code: 400, message: 'MISSING_REQUIRED_FIELD' });

        const refuels = await refuelService.getRefuels({ userId: _id });

        return res.status(200).json({ code: 200, payload: refuels })
    } catch (err) {
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