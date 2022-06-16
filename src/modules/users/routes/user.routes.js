import express from "express";
import { createUser, makeSignIn, getUser, getUsers, updateUserInfo, updateUserStatus, updateUserPassword, deleteUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/:_id", updateUserPassword);
router.get('/signin', makeSignIn)
router.get("/", getUsers);
router.get("/:_id", getUser);
router.patch("/:_id", updateUserInfo);
router.patch("/status/:_id", updateUserStatus);
router.delete("/:_id", deleteUser);

export {router as userRoutes};