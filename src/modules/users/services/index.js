import { makeService as makeUserService } from "./user.service.js";
import { UserModel } from "../models/user.model.js";
import { makeUserRepository } from "../repositories/index.js";

export const userService = makeUserService({ ...makeUserRepository(UserModel) });