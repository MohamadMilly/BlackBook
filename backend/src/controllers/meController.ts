import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { getUser } from "../services/usersService.js";
import { CurrentUserData, Post, User } from "@app/types";
import { getUserPosts } from "../services/postsService.js";

const getCurrentUserGet = async (
  req: AuthenticatedRequest,
  res: Response<CurrentUserData | { message: string }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;
  try {
    const user = (await getUser(currentUserId, {
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    })) as User & {
      _count: {
        followers: number;
        following: number;
      };
    };
    if (!user) {
      res.status(404).json({
        message: "User is not found.",
      });
    } else {
      res.json({
        user: user,
        followersCount: user._count.followers,
        followingCount: user._count.following,
      });
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
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    );

    res.json({ posts: posts });
  } catch (err) {
    next(err);
  }
};
