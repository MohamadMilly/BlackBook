import { toggleLike } from "../services/likesService.js";
import { AuthenticatedRequest } from "../types/index.js";
import type { Response, NextFunction } from "express";

export const toggleLikePost = async (
  req: AuthenticatedRequest<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.currentUser;
  const { postId } = req.params;
  try {
    const { like, operation } = await toggleLike(
      currentUser?.id as number,
      JSON.parse(postId),
    );
    res.json({ like, operation });
  } catch (err) {
    next(err);
  }
};
