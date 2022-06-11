import { makeService as makeRefuelService } from './refuel.service.js'
// models
import RefuelModel from '../models/refuel.model.js'

export const refuelService = makeRefuelService(RefuelModel)