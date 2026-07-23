import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { getUser } from "../services/usersService.js";
import { Post, User } from "@app/types";
import { getUserPosts } from "../services/postsService.js";

const getCurrentUserGet = async (
  req: AuthenticatedRequest,
  res: Response<{ user: User } | { message: string }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;
  try {
    const user = await getUser(currentUserId);
    if (!user) {
      res.json({
        message: "User is not found.",
      });
    } else {
      res.json({ user: user });
    }
  } catch (err) {
    next(err);
  }
};

export { getCurrentUserGet };

export const getCurrentUserPosts = async (
  req: AuthenticatedRequest,
  res: Response<{ posts: Required<Post>[] }>,
  next: NextFunction,
) => {
  const currentUser = req.currentUser;
  try {
    const posts = await getUserPosts<Required<Post>>(
      currentUser?.id as number,
      {
        include: {
          user: true,
        },
      },
    );

    res.json({ posts: posts });
  } catch (err) {
    next(err);
  }
};
