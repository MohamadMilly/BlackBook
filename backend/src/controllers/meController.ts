import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { getUser, patchProfile } from "../services/usersService.js";
import { CurrentUserData, Post, Profile, User } from "@app/types";
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
        profile: true,
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
  res: Response<{ posts: Required<Post[]> }>,
  next: NextFunction,
) => {
  const currentUser = req.currentUser;
  try {
    const posts = await getUserPosts(currentUser?.id as number, {
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const postsWithCommentsCounts = posts.map(({ _count, ...post }) => ({
      ...post,
      commentsCount: _count.comments,
    }));
    res.json({ posts: postsWithCommentsCounts });
  } catch (err) {
    next(err);
  }
};

export const patchProfilePatch = async (
  req: AuthenticatedRequest,
  res: Response<{ profile: Profile }>,
  next: NextFunction,
) => {
  const data = req.body;
  const currentUserId = req.currentUser?.id;
  try {
    const updatedProfile = await patchProfile(currentUserId as number, data);

    res.json({ profile: updatedProfile });
  } catch (err) {
    next(err);
  }
};
