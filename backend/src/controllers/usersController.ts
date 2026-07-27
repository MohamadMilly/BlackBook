import type { Request, Response, NextFunction } from "express";
import { getUser, getUsers } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
import {
  FollowRequest,
  GetUserResponseBody,
  Post,
  User,
  UserFollowDataType,
} from "@app/types";
import { AuthenticatedRequest } from "../types/index.js";

export const getUserGet = async (
  req: AuthenticatedRequest<{ userId: string }>,
  res: Response<GetUserResponseBody | { message: string }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;
  const { userId } = req.params;
  try {
    const { followers, receivedFollowRequests, ...user } = (await getUser(
      JSON.parse(userId),
      {
        include: {
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
          followers: {
            where: {
              id: currentUserId,
            },
          },
          receivedFollowRequests: {
            where: {
              senderId: currentUserId,
            },
          },
          profile: true,
        },
      },
    )) as User & {
      _count: {
        followers: number;
        following: number;
      };
      receivedFollowRequests: FollowRequest[];
      followers: Omit<User, "password">;
    };
    if (!user) {
      res.status(404).json({
        message: "User is not found.",
      });
    }

    res.json({
      followingCount: user._count.following,
      isFollowed: followers.length === 1,
      pendingFollowRequest: receivedFollowRequests[0],
      hasPendingFollowRequest: receivedFollowRequests.length === 1,
      followersCount: user._count.followers,
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserPostsGet = async (
  req: Request<{ userId: string }>,
  res: Response<{ posts: Required<Post[]> }>,
  next: NextFunction,
) => {
  const { userId } = req.params;
  try {
    const posts = await getUserPosts(JSON.parse(userId), {
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            createdAt: true,
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
    const postsWithCommentsCounts = posts.map(({ _count, ...post }) => {
      return { ...post, commentsCount: _count.comments };
    });
    res.json({ posts: postsWithCommentsCounts });
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
  res: Response<{
    users: (Omit<User, "password"> & UserFollowDataType)[];
    nextCursor: number | undefined;
  }>,
  next: NextFunction,
) => {
  const { search, cursor } = req.query;
  const numCursor = cursor ? JSON.parse(cursor) : undefined;
  const currentUserId = req.currentUser?.id;
  const excludeCurrentUserOptions = currentUserId
    ? {
        where: {
          NOT: {
            id: currentUserId as number,
          },
        },
      }
    : {};
  const limit = 30;
  try {
    const users = await getUsers(search, numCursor, limit, {
      ...excludeCurrentUserOptions,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        createdAt: true,

        followers: {
          where: {
            id: currentUserId,
          },
        },
        receivedFollowRequests: {
          where: {
            senderId: currentUserId,
          },
        },
        profile: true,
      },
    });

    const usersWithFollowData = users.map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      createdAt: user.createdAt,
      isFollowed: user.followers.length === 1,
      profile: user.profile,
      hasPendingFollowRequest: user.receivedFollowRequests.length === 1,
    }));
    const nextCursor = users[limit - 1] ? users[limit - 1].id : undefined;
    res.json({ users: usersWithFollowData, nextCursor });
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
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const currentUserId = req.currentUser?.id as number;
  const limit = 30;
  const { search, cursor } = req.query;
  const numCursor = cursor ? JSON.parse(cursor) : undefined;
  try {
    const userFollowers = await getUsers(search, numCursor, limit, {
      where: {
        following: {
          some: {
            id: JSON.parse(userId),
          },
        },
      },
      include: {
        followers: {
          where: {
            id: currentUserId,
          },
        },
        receivedFollowRequests: {
          where: {
            senderId: currentUserId,
          },
        },
        profile: true,
      },
    });

    const userFollowersWithFollowData = userFollowers.map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      createdAt: user.createdAt,
      isFollowed: user.followers.length === 1,
      profile: user.profile,
      hasPendingFollowRequest: user.receivedFollowRequests.length === 1,
    }));
    const nextCursor =
      userFollowers.length === limit
        ? userFollowers[userFollowers.length - 1].id
        : undefined;

    res.json({
      followers: userFollowersWithFollowData,
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
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const currentUserId = req.currentUser?.id as number;
  const limit = 30;
  const { search, cursor } = req.query;
  const numCursor = cursor ? JSON.parse(cursor) : undefined;
  try {
    const userFollowings = await getUsers(search, numCursor, limit, {
      where: {
        followers: {
          some: {
            id: JSON.parse(userId),
          },
        },
      },
      include: {
        followers: {
          where: {
            id: currentUserId,
          },
        },
        receivedFollowRequests: {
          where: {
            senderId: currentUserId,
          },
        },
        profile: true,
      },
    });

    const userFollowingsWithFollowData = userFollowings.map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      createdAt: user.createdAt,
      isFollowed: user.followers.length === 1,
      profile: user.profile,
      hasPendingFollowRequest: user.receivedFollowRequests.length === 1,
    }));
    const nextCursor =
      userFollowings.length === limit
        ? userFollowings[userFollowings.length - 1].id
        : undefined;

    res.json({
      followings: userFollowingsWithFollowData,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
};
