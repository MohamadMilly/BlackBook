import express from "express";
import { extractToken } from "../middlewares/auth/extractToken.js";
import { verifyToken } from "../middlewares/auth/verifyToken.js";
import * as postsController from "../controllers/postsController.js";
import { validateCreatePost } from "../middlewares/posts/validation/validateCreatePost.js";
import { handleValidationErrors } from "../middlewares/shared/handleValidationErrors.js";
import * as likesController from "../controllers/likesController.js";

export const postsRouter = express.Router();

postsRouter.use(extractToken);
postsRouter.use(verifyToken);

postsRouter.get("/", postsController.getPostsGet);
postsRouter.post(
  "/",
  validateCreatePost,
  handleValidationErrors,
  postsController.create,
);
postsRouter.post("/:postId/likes", likesController.toggleLikePost);
