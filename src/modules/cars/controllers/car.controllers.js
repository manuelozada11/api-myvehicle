import { carService } from "../services/index.js"

export const createCar = async (req, res) => {
    try {
        const { brand, model, year, km, user, plateNumber } = req.body;
    
        if (!brand || !model || !year || !km || !user || !user?._id || !plateNumber) return res.status(400).json({ message: 'missing required fields' })
    
        const result = await carService.createCar(brand, model, year, km, plateNumber, user)
        if (result.error) return res.status(500).json({ message: result.error })
        
        return res.status(200).json({ message: 'car created successfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'internal server error' })
    }
}

export const getCar = async (req, res) => {
    try {
        const { _idUser, _idCar } = req.params;
        
        if (!_idCar || !_idUser) return res.status(400).json({ message: 'missing required fields' })
        
        const car = await carService.getCar(_idUser, _idCar)
        if (car?.length === 0) return res.status(404).json({ message: 'car not found' })

        return res.status(200).json({ message: 'car found', payload: car });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'internal server error' })
    }
}

export const getCars = async (req, res) => {
    try {
        const { _id } = req.params
        
        if (!_id) return res.status(400).json({ message: 'missing required fields' })
        const cars = await carService.getCars(_id)

        if (cars?.length === 0) return res.status(404).json({ message: 'cars not found' })

        return res.status(200).json({ message: 'cars found', payload: cars })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'internal server error' })
    }
}

export const updateCar = async (req, res) => {
    try {
        const { _idUser, _idCar } = req.params
        const { brand, model, year, km, plateNumber } = req.body

        if (!_idUser || !_idCar) return res.status(400).json({ message: 'missing required field' })
        const car = await carService.updateCar(_idUser, _idCar, brand, model, year, km, plateNumber)
        console.log(car)

        return res.status(200).json({ message: 'cars updated succesfully', payload: car })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'internal server error' })
    }
}

export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.params

        if (!_id) return res.status(400).json({ message: 'missing required field' })
        const result = await carService.deleteCar(_id)
        console.log(result)

        return res.status(200).json({ message: 'car deleted successfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'internal server error' })
    }
}