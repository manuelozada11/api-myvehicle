import mongoose from "mongoose";

export const makeService = (CarModel) => {
    return {
        createCar: async (brand, model, year, km, plateNumber, user) => await CarModel.createCar({ brand, model, year, km, plateNumber, user }),
        getCar: async (_idUser, _idCar) => {
            return await CarModel.getCars({ _id: mongoose.Types.ObjectId(_idCar), user: { _id: mongoose.Types.ObjectId(_idUser) } })
        },
        getCars: async (_idUser) => {
            return await CarModel.getCars({ user: { _id: mongoose.Types.ObjectId(_idUser) } })
        },
        updateCar: async (_idUser, _idCar, brand, model, year, km, plateNumber) => {
            return await CarModel.updateCar({ _id: mongoose.Types.ObjectId(_idCar), user: { _id: _idUser } }, { brand, model, year, km, plateNumber })
        },
        deleteCar: async (_id) => {
            return await CarModel.deleteCar({ _id: mongoose.Types.ObjectId(_id) })
        }
    }
}