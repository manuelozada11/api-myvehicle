import express from 'express';
import { checkAuth } from "../../shared/middlewares/checkAuth.js";
import { createRefuel, getRefuel, getRefuels, updateRefuel, deleteRefuel } from '../controllers/refuel.controllers.js';

const router = express.Router()

router.post('/', createRefuel)
router.get('/:_id', checkAuth, getRefuel)
router.get('/vehicle/:_id', checkAuth, getRefuel)
router.get('/', checkAuth, getRefuels)
router.patch('/:_id', updateRefuel)
router.delete('/:_id', deleteRefuel)

export {router as refuelRoutes }