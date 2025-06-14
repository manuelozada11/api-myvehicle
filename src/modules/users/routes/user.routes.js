import express from "express";
import { checkAuth } from '../../../shared/middlewares/checkAuth.js';
import { createUser, makeSignIn, getUser, getUsers, updateUserInfo, updateUserStatus, updateUserPassword, deleteUser, createRateApp, googleSignin } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/:_id", checkAuth, updateUserPassword);
router
  .post("/:_id/rate", checkAuth, createRateApp)
  .post('/auth/google', googleSignin);
router
  .get('/signin', makeSignIn)
  .get("/", checkAuth, getUsers)
  .get("/:_idUser", checkAuth, getUser);
router.patch("/:_id", checkAuth, updateUserInfo);
router.patch("/status/:_id", checkAuth, updateUserStatus);
router.delete("/:_id", checkAuth, deleteUser);

export { router as userRoutes };