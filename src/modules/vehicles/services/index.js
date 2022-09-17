import { makeService as makeVehicleService } from "./vehicle.services.js";
import { VehicleModel } from "../models/index.js";
import { makeVehicleRepository } from "../repositories/index.js";

export const vehicleService = makeVehicleService({ ...makeVehicleRepository(VehicleModel) });