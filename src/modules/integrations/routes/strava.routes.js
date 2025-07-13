import express from "express";
import { verifyChallenge, newEvent } from "../controllers/strava.controllers.js";

const router = express.Router();

router.get('/webhook', verifyChallenge);
router.post('/webhook', newEvent);

export { router as stravaRoutes };