import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const makeService = (VehicleModel) => {
    const createVehicle = async (data) => await VehicleModel.createVehicle(data);

    const getVehicleById = async ({ _idUser, _idVehicle }) => {
        const allData = await VehicleModel.getVehicleById({ _id: mongoose.Types.ObjectId(_idVehicle), "user._id": mongoose.Types.ObjectId(_idUser) });

        // reduce to main details
        
        return allData;
    }

    const getVehicleInfoById = async ({ _idUser, _idVehicle }) => {
        return await VehicleModel.getVehicleById({ _id: mongoose.Types.ObjectId(_idVehicle), "user._id": mongoose.Types.ObjectId(_idUser) })
    }

    const getVehiclesByUser = async ({ _id }) => {
        const vehicles = await VehicleModel.getVehicles({ "user._id": mongoose.Types.ObjectId(_id) });

        if (!vehicles.length) return [];

        const vcResponse = vehicles.map(vehicle => {
            const fullname = `${ vehicle.manufacture } ${ vehicle.model }`;
            return {
                _id: vehicle._id,
                user: vehicle.user,
                fullname: vehicle.vehicleType === 'bicycle' ? vehicle.manufacture : fullname,
                plateNumber: vehicle.plateNumber,
                model: vehicle.vehicleType === 'bicycle' ? vehicle.model : undefined,
                vehicleType: vehicle.vehicleType,
            }
        });

        return vcResponse;
    }

    const deleteVehicle = async ({ _id }) => {
        return await VehicleModel.deleteVehicle({ _id: mongoose.Types.ObjectId(_id) })
    }

    const updateVehicle = async (data) => {
        return await VehicleModel.updateVehicle(data);
    }

    const transferVehicle = async (data) => {
        const { lastOwner, _userId, _vehicleId } = data;

        const jwtResult = await jwt.verify(lastOwner, process.env.JWT_SECRET, async (err, user) => {
            if (err) return { message: 'invalid user' };
    
            if (user.iss === process.env.JWT_ISS) return { message: "valid user", user };
            else return { message: 'invalid user' };
        });

        if (jwtResult.message === 'invalid user') return { code: 401, message: 'invalid user' };

        const vehicle = await getVehicleInfoById({ _idUser: jwtResult.user._id, _idVehicle: _vehicleId });

        if (!vehicle) return { code: 404, message: 'vehicle not found' };
        if (!vehicle.isTransferActivated) return { code: 203, message: 'vehicle transferation isnt activated' };

        const fields = {
            _userId: jwtResult.user._id,
            _vehicleId,
            user: { _id: _userId },
            "$push": { lastOwners: { _id: jwtResult.user._id, fullname: `${jwtResult.user.name} ${jwtResult.user.lastname}` } },
            isTransferActivated: false
        }
        const updateResult = await updateVehicle(fields);

        if (!updateResult) return { code: 500, message: 'vehicle cant be transfered' };

        return { code: 200, message: 'vehicle transfered succesfully' };
    }

    return {
        createVehicle,
        getVehicleById,
        getVehicleInfoById,
        getVehiclesByUser,
        updateVehicle,
        deleteVehicle,
        transferVehicle
    }
}