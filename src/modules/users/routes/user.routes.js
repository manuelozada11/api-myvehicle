import express from "express";
import { checkAuth } from '../../../shared/middlewares/checkAuth.js';
import { createUser, makeSignIn, getUser, getUsers, updateUserInfo, updateUserStatus, updateUserPassword, deleteUser, createRateApp, googleSignin, addIntegration, 
  activateUser, forgotPassword, resetPassword, getUserNotifications, markNotificationsAsRead
 } from "../controllers/user.controllers.js";

const router = express.Router();

router
  .post("/signup", createUser)
  .post('/activate', checkAuth, activateUser)
  .post('/auth/google', googleSignin)
  .post('/integration/:_id', addIntegration)
  .post('/forgot-password', forgotPassword)
  .post('/reset-password', checkAuth, resetPassword)
  .post("/:_id", checkAuth, updateUserPassword)
  .post("/:_id/rate", checkAuth, createRateApp)

router
  .get('/signin', makeSignIn)
  .get('/notifications', checkAuth, getUserNotifications)
  .get("/", checkAuth, getUsers)
  .get("/:_idUser", checkAuth, getUser);

router.patch("/:_id", checkAuth, updateUserInfo);
router.patch("/status/:_id", checkAuth, updateUserStatus);
router.patch('/notifications/read', checkAuth, markNotificationsAsRead);
router.delete("/:_id", checkAuth, deleteUser);

export { router as userRoutes };