import express from "express";
import { extractToken } from "../middlewares/auth/extractToken.js";
import { verifyToken } from "../middlewares/auth/verifyToken.js";
import * as meController from "../controllers/meController.js";
export const meRouter = express.Router();
meRouter.use(extractToken);
meRouter.use(verifyToken);
meRouter.get("/", meController.getCurrentUserGet);
meRouter.get("/posts", meController.getCurrentUserPosts);
