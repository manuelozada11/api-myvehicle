import { Router } from 'express';
import { createRefuel, getRefuel, getRefuels, updateRefuel, deleteRefuel, getRefuelsByVehicle } from '../controllers/refuel.controllers.js';

const router = Router();

router.post('/:_idVehicle', createRefuel);
router.get('/:_idRefuel', getRefuel);
router.get('/vehicle/:_idVehicle', getRefuelsByVehicle);
router.get('/', getRefuels);
router.patch('/:_id', updateRefuel);
router.delete('/:_id', deleteRefuel);

export { router as refuelRoutes };