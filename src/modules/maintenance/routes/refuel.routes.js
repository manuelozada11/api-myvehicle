import express from 'express';
import { checkAuth } from "../../shared/middlewares/checkAuth.js";
import { createRefuel, getRefuel, getRefuels, updateRefuel, deleteRefuel, getRefuelsByVehicle } from '../controllers/refuel.controllers.js';

const router = express.Router()

router.post('/vehicle/:_idVehicle', checkAuth, createRefuel)
router.get('/:_idRefuel', checkAuth, getRefuel)
router.get('/vehicle/:_idVehicle', checkAuth, getRefuelsByVehicle)
router.get('/', checkAuth, getRefuels)
router.patch('/:_id', checkAuth, updateRefuel)
router.delete('/:_id', checkAuth, deleteRefuel)

export { router as refuelRoutes }