import express from 'express'
import { createRefuel, getRefuelInfo, updateRefuel, deleteRefuel } from '../controllers/refuel.controllers.js'

const router = express.Router()

// console.log(`creating refuel methods...`);

router.post('/', createRefuel)
router.get('/:_id', getRefuelInfo)
router.patch('/:_id', updateRefuel)
router.delete('/:_d', deleteRefuel)

export {router as refuelRoutes }