import express from "express";
import { checkAuth } from '../../shared/middlewares/checkAuth.js';
import { createUser, makeSignIn, getUser, getUsers, updateUserInfo, updateUserStatus, updateUserPassword, deleteUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/:_id", updateUserPassword);
router.get('/signin', makeSignIn)
router.get("/", checkAuth, getUsers);
router.get("/:_idUser", checkAuth, getUser);
router.patch("/:_id", updateUserInfo);
router.patch("/status/:_id", updateUserStatus);
router.delete("/:_id", deleteUser);

export { router as userRoutes };