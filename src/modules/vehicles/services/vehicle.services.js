import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { maintenanceService } from '../../maintenance/services/maintenance.service.js';
import { userService } from '../../users/services/user.service.js';
import { VehicleModel } from "../models/index.js";
import { makeVehicleRepository } from "../repositories/index.js";

export const makeService = (VehicleModel) => {
  const createVehicle = async ({ user, ...data }) => {
    const owner = {
      _id: user._id,
      fullname: `${user.name} ${user.lastname}`
    }

    return await VehicleModel.createVehicle({ user: owner, ...data });
  };

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
      const fullname = `${vehicle.manufacture} ${vehicle.model}`;
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

  const getVehiclesBy = async (filter) => {
    const vehicles = await VehicleModel.getVehicles(filter);

    if (!vehicles.length) return [];

    const vcResponse = vehicles.map(vehicle => {
      const fullname = `${vehicle.manufacture} ${vehicle.model}`;
      return {
        _id: vehicle._id,
        user: vehicle.user,
        fullname: vehicle.vehicleType === 'bicycle' ? vehicle.manufacture : fullname,
        plateNumber: vehicle.plateNumber,
        model: vehicle.vehicleType === 'bicycle' ? vehicle.model : undefined,
        vehicleType: vehicle.vehicleType,
        displacement: vehicle.displacement
      }
    });

    return vcResponse;
  }

  const deleteVehicle = async ({ user, _id }) => {
    // remove refuelings

    // remove maintenances 
    await maintenanceService.deleteMaintenance({ userId: user._id, vehicleId: _id });

    // remove vehicle
    await VehicleModel.deleteVehicle({ _id: _id })

    return { code: 200, message: 'vehicle deleted succesfully' };
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
      userId: jwtResult.user._id,
      vehicleId: _vehicleId,
      user: { _id: _userId },
      "$push": { lastOwners: { _id: jwtResult.user._id, fullname: `${jwtResult.user.name} ${jwtResult.user.lastname}` } },
      isTransferActivated: false
    }
    const updateResult = await updateVehicle(fields);

    if (!updateResult) return { code: 500, message: 'vehicle cant be transfered' };

    return { code: 200, message: 'vehicle transfered succesfully' };
  }

  const getExternalVehicles = async ({ userId, integration }) => {
    const user = await userService.getUserById({ _id: userId });
    if (!user) return { code: 404, message: 'user not found' };

    if (integration !== 'strava') return { code: 404, message: 'integration not supported' };

    const userConfig = user.integrations.find(i => i.name === integration);
    if (!userConfig) return { code: 404, message: 'integration not found' };

    const bikes = await _getAthleteBikes(userConfig);
    if (!bikes.length) return { code: 404, message: 'no bikes found' };

    // check if vehicle already exists
    const noExistingBikes = await Promise.all(bikes.map(async (bike) => {
        const exists = await _vehicleExists(userId, bike.id, integration);
        if (exists) return null;

        return bike;
      }
    ));
    const filteredBikes = noExistingBikes.filter(bike => bike !== null);
    if (!filteredBikes.length) return { code: 404, message: 'no bikes found' };

    return { code: 200, message: "bikes found", payload: bikes };
  }

  const connectIntegration = async ({ userId, extId, integrationName, vehicleId, displacement }) => {
    const user = await userService.getUserById({ _id: userId });
    if (!user) return { code: 404, message: 'user not found' };

    if (integrationName !== 'strava') return { code: 404, message: 'integration not supported' };
    const userConfig = user.integrations.find(i => i.name === integrationName);
    if (!userConfig) return { code: 404, message: 'integration not found' };

    const vehicle = await VehicleModel.getVehicleById({ _idVehicle: vehicleId, _idUser: userId });
    if (!vehicle) return { code: 404, message: 'vehicle not found' };

    const params = {
      vehicleId,
      userId,
      extId,
      from: integrationName,
      displacement: displacement ? Number(displacement) : vehicle.displacement,
    }
    const connected = await updateVehicle(params);

    return { code: 200, message: 'vehicle connected successfully' };
  }

  // Private Functions
  const _getAthleteBikes = async (userConfig) => {
    const athlete = await userService.getStravaAthlete(userConfig);
    if (!athlete) return [];

    const bikes = athlete?.bikes;

    return bikes;
  }

  const _vehicleExists = async (userId, extId, integrationName) => {
    const exists = await VehicleModel.getVehicles({ "user._id": userId, from: integrationName, extId });
    return exists?.length > 0 ? true : false;
  }

  return {
    createVehicle,
    getVehicleById,
    getVehicleInfoById,
    getVehiclesByUser,
    getVehiclesBy,
    updateVehicle,
    deleteVehicle,
    transferVehicle,
    getExternalVehicles,
    connectIntegration
  }
}


export const vehicleService = makeService({ ...makeVehicleRepository(VehicleModel) });