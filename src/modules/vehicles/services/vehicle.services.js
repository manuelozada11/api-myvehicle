import mongoose from "mongoose";

export const makeService = (VehicleModel) => {
    const createVehicle = async (data) => await VehicleModel.createVehicle(data);

    const getVehicleBydId = async ({ _idUser, _idVehicle }) => {
        return await VehicleModel.getVehicleById({ _id: mongoose.Types.ObjectId(_idVehicle), "user._id": mongoose.Types.ObjectId(_idUser) })
    }

    const getVehiclesByUser = async ({ _id }) => {
        const vehicles = await VehicleModel.getVehicles({ "user._id": mongoose.Types.ObjectId(_id) });

        if (!vehicles.length) return [];

        const vcResponse = vehicles.map(vehicle => {
            return {
                _id: vehicle._id,
                user: vehicle.user,
                fullname: `${ vehicle.manufacture } ${ vehicle.model }`,
                plateNumber: vehicle.plateNumber
            }
        });

        return vcResponse;
    }

    return {
        createVehicle,
        getVehicleBydId,
        getVehiclesByUser,
        updateVehicle: async (_idUser, _idVehicle, brand, model, year, km, plateNumber) => {
            return await VehicleModel.updateVehicle({ _id: mongoose.Types.ObjectId(_idVehicle), user: { _id: _idUser } }, { brand, model, year, km, plateNumber })
        },
        deleteVehicle: async (_id) => {
            return await VehicleModel.deleteVehicle({ _id: mongoose.Types.ObjectId(_id) })
        }
    }
}