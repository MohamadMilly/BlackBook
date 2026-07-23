import express, { type Router } from "express";
import { extractToken } from "../middlewares/auth/extractToken.js";
import { verifyToken } from "../middlewares/auth/verifyToken.js";
import * as usersController from "../controllers/usersController.js";

export const usersRouter: Router = express.Router();

usersRouter.use(extractToken);
usersRouter.use(verifyToken);

usersRouter.get("/", usersController.getUsersGet);
usersRouter.get("/:userId", usersController.getUserGet);
usersRouter.get("/:userId/posts", usersController.getUserPostsGet);
