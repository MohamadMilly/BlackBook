import { toggleLike } from "../services/likesService.js";
import { AuthenticatedRequest } from "../types/index.js";
import type { Response, NextFunction } from "express";
import { ToggleLikeResponseBody } from "@app/types";

export const toggleLikePost = async (
  req: AuthenticatedRequest<{ postId: string }>,
  res: Response<ToggleLikeResponseBody>,
  next: NextFunction,
) => {
  const currentUser = req.currentUser;
  const { postId } = req.params;
  const numPostId = Number(postId);
  try {
    const { like, operation } = await toggleLike(
      currentUser?.id as number,
      numPostId,
    );
    res.json({ like, operation });
  } catch (err) {
    next(err);
  }
};
