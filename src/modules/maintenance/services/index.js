import { makeService as makeRefuelService } from './refuel.service.js'
import { RefuelModel } from '../models/index.js'
import { makeRefuelRepository } from '../repositories/index.js'

export const refuelService = makeRefuelService({...makeRefuelRepository(RefuelModel)})