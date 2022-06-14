import {refuelService} from '../services/index.js';

export const createRefuel = async (req, res) => {
    try {
        const { date, fuel, amount, quantity, gasStation, location } = req.body;

        if (!fuel || !amount || !quantity) return res.status(400).json({ error: 'missing required fields' });

        await refuelService.createRefuel(date, fuel, amount, quantity, gasStation, location);

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
        const refuels = await refuelService.getRefuels({});

        res.status(200).json({ message: 'connection success', refuel: refuels })
    } catch (err) {
        console.log(err)
        res.status(err.code).json({message: err.message})
    }
}

export const updateRefuel = async (req, res) => {
    try {
        const { _id } = req.params;
        const { date, fuel, amount, quantity, gasStation, location } = req.body;

        if (!_id || !fuel || !amount || !quantity) return res.status(400).json({ error: 'missing required fields' });

        const refuel = await refuelService.updateRefuel(_id, date, fuel, amount, quantity, gasStation, location);

        res.status(200).json({ message: 'updated successfully', refuel: refuel })
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