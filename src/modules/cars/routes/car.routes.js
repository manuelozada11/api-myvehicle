import express from "express";
import { createCar, getCar, getCars, updateCar, deleteCar } from "../controllers/car.controllers.js";

const router = express.Router();

router.post('/', createCar);
router.get('/user/:_id', getCars);
router.get('/usr=:_idUser&car=:_idCar', getCar);
router.patch('/usr=:_idUser&car=:_idCar', updateCar);
router.delete('/:_id', deleteCar);

export { router as carRoutes }