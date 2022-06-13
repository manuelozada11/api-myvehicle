// services
import { makeService as makeRefuelService } from './refuel.service.js'
// models
import { RefuelModel } from '../models/index.js'
// repositories
import { makeRefuelRepository } from '../repositories/index.js'

export const refuelService = makeRefuelService({...makeRefuelRepository(RefuelModel)})