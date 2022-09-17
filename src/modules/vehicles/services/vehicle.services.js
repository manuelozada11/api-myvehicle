import mongoose from "mongoose";

export const makeService = (VehicleModel) => {
    const getVehiclesByUser = async ({ _id }) => {
        return await VehicleModel.getVehicles({ "user._id": mongoose.Types.ObjectId(_id) });
    }

    return {
        createVehicle: async (manufacture, model, year, displacement, plateNumber, user, type, energyType) => await VehicleModel.createVehicle({ manufacture, model, year, displacement, plateNumber, type, energyType, user }),
        getVehicle: async (_idUser, _idVehicle) => {
            return await VehicleModel.getVehicleById({ _id: mongoose.Types.ObjectId(_idVehicle), "user._id": mongoose.Types.ObjectId(_idUser) })
        },
        getVehiclesByUser,
        updateVehicle: async (_idUser, _idVehicle, brand, model, year, km, plateNumber) => {
            return await VehicleModel.updateVehicle({ _id: mongoose.Types.ObjectId(_idVehicle), user: { _id: _idUser } }, { brand, model, year, km, plateNumber })
        },
        deleteVehicle: async (_id) => {
            return await VehicleModel.deleteVehicle({ _id: mongoose.Types.ObjectId(_id) })
        }
    }
}