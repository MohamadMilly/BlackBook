import type { Request, Response, NextFunction } from "express";
import { getUser, getUsers } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
import {
  GetFollowersResponseBody,
  GetFollowingsResponseBody,
  GetPostsResponseBody,
  GetUserResponseBody,
  GetUsersResponseBody,
  Post,
  PostType,
} from "@app/types";
import { AuthenticatedRequest } from "../types/index.js";
import { userPresenters } from "../presenters/user.presenters.js";
import { postPresenters } from "../presenters/post.presenter.js";

export const getUserGet = async (
  req: AuthenticatedRequest<{ userId: string }>,
  res: Response<GetUserResponseBody | { message: string }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;
  const { userId } = req.params;
  const numUserId = Number(userId);
  try {
    const userData = await getUser(numUserId, currentUserId);

    if (!userData) {
      res.status(404).json({
        message: "User is not found.",
      });
      return;
    }
    const formattedUser = userPresenters.presentUser(userData);
    res.json(formattedUser);
  } catch (err) {
    next(err);
  }
};

export const getUserPostsGet = async (
  req: AuthenticatedRequest<
    { userId: string },
    unknown,
    {},
    { type: PostType | undefined }
  >,
  res: Response<GetPostsResponseBody>,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const numUserId = Number(userId);
  const currentUserId = req.currentUser?.id as number;
  const { type } = req.query;
  try {
    const posts = await getUserPosts(numUserId, type ?? "FEED", currentUserId);
    const formattedUserPosts = postPresenters.presentPostsList(posts);
    res.json({ posts: formattedUserPosts });
  } catch (err) {
    next(err);
  }
};

export const getUsersGet = async (
  req: AuthenticatedRequest<
    {},
    unknown,
    {},
    { search: string | undefined; cursor: string | undefined }
  >,
  res: Response<GetUsersResponseBody>,
  next: NextFunction,
) => {
  const { search, cursor } = req.query;
  const numCursor = cursor ? Number(cursor) : undefined;
  const currentUserId = req.currentUser?.id as number;

  const limit = 30;
  try {
    const users = await getUsers(search, numCursor, limit, currentUserId, {
      NOT: {
        id: currentUserId,
      },
    });

    const formattedUsers = userPresenters.presentUsersList(users);

    const nextCursor = users[limit - 1] ? users[limit - 1].id : undefined;

    res.json({ users: formattedUsers, nextCursor });
  } catch (err) {
    next(err);
  }
};

export const getUserFollowersGet = async (
  req: AuthenticatedRequest<
    { userId: string },
    unknown,
    {},
    { search: string | undefined; cursor: string | undefined }
  >,
  res: Response<GetFollowersResponseBody>,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const currentUserId = req.currentUser?.id as number;
  const limit = 30;
  const { search, cursor } = req.query;
  const numCursor = cursor ? Number(cursor) : undefined;
  try {
    const userFollowers = await getUsers(
      search,
      numCursor,
      limit,
      currentUserId,
      {
        following: {
          some: {
            id: JSON.parse(userId),
          },
        },
      },
    );

    const nextCursor = userFollowers[limit - 1]
      ? userFollowers[limit - 1].id
      : undefined;
    const formattedUserFollowers =
      userPresenters.presentUsersList(userFollowers);
    res.json({
      followers: formattedUserFollowers,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserFollowingsGet = async (
  req: AuthenticatedRequest<
    { userId: string },
    unknown,
    {},
    { search: string | undefined; cursor: string | undefined }
  >,
  res: Response<GetFollowingsResponseBody>,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const numUserId = Number(userId);
  const currentUserId = req.currentUser?.id as number;
  const limit = 30;
  const { search, cursor } = req.query;
  const numCursor = cursor ? Number(currentUserId) : undefined;
  try {
    const userFollowings = await getUsers(
      search,
      numCursor,
      limit,
      currentUserId,
      {
        followers: {
          some: {
            id: numUserId,
          },
        },
      },
    );
    const formattedUserFollowings =
      userPresenters.presentUsersList(userFollowings);

    const nextCursor = userFollowings[limit - 1]
      ? userFollowings[limit - 1].id
      : undefined;

    res.json({
      followings: formattedUserFollowings,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
};
