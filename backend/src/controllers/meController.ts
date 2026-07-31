import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { getUser, patchProfile } from "../services/usersService.js";
import { CurrentUserData, Post, PostType, Profile, User } from "@app/types";
import { getUserPosts } from "../services/postsService.js";
import { getPostsQueryOptions } from "../shared/queryOptions.js";

const getCurrentUserGet = async (
  req: AuthenticatedRequest,
  res: Response<CurrentUserData | { message: string }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;

  try {
    const userData = (await getUser(currentUserId, {
      withProfile: true,
      withRecentStoryId: true,
      withFollowCounts: true,
    })) as CurrentUserData;
    if (!userData) {
      res.status(404).json({
        message: "User is not found.",
      });
    } else {
      res.json({
        ...userData,
      });
    }
  } catch (err) {
    next(err);
  }
};

export { getCurrentUserGet };

export const getCurrentUserPosts = async (
  req: AuthenticatedRequest<{}, unknown, {}, { type: PostType | undefined }>,
  res: Response<{ posts: Required<Post[]> }>,
  next: NextFunction,
) => {
  const currentUser = req.currentUser;
  const { type } = req.query;
  try {
    const posts = await getUserPosts(
      currentUser?.id as number,
      type ?? "FEED",
      getPostsQueryOptions,
    );
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
