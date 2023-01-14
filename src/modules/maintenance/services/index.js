import { makeService as makeRefuelService } from './refuel.service.js'
import { makeService as makeMaintenanceService } from "./maintenance.service.js";
import { 
    RefuelModel, 
    MaintenanceModel } from '../models/index.js'
import { 
    makeRefuelRepository,
    makeMaintenanceRepository } from '../repositories/index.js'

export const refuelService = makeRefuelService({...makeRefuelRepository(RefuelModel)})
export const maintenanceService = makeMaintenanceService({...makeMaintenanceRepository(MaintenanceModel)});