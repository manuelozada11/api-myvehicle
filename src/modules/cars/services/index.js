import { makeService as makeCarService } from "./car.services.js";
import { CarModel } from "../models/index.js";
import { makeCarRepository } from "../repositories/index.js";

export const carService = makeCarService({ ...makeCarRepository(CarModel) });