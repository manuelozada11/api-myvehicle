import express from 'express'
import { createRefuel, getRefuel, getRefuels, updateRefuel, deleteRefuel } from '../controllers/refuel.controllers.js'

const router = express.Router()

router.post('/', createRefuel)
router.get('/:_id', getRefuel)
router.get('/', getRefuels)
router.patch('/:_id', updateRefuel)
router.delete('/:_id', deleteRefuel)

export {router as refuelRoutes }