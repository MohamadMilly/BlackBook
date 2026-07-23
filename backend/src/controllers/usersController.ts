import type { Request, Response, NextFunction } from "express";
import { getUser, getUsers } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
import { Post, User } from "@app/types";
import { AuthenticatedRequest } from "../types/index.js";

export const getUserGet = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  try {
    const user = await getUser(JSON.parse(userId));
    res.json({
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserPostsGet = async (
  req: Request<{ userId: string }>,
  res: Response<{ posts: Required<Post>[] }>,
  next: NextFunction,
) => {
  const { userId } = req.params;
  try {
    const posts = await getUserPosts<Required<Post>>(JSON.parse(userId), {
      include: {
        user: true,
      },
    });
    res.json({ posts });
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
    users: Omit<User, "password">[];
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
  const limit = 3;
  try {
    const users = await getUsers(search, numCursor, limit, {
      ...excludeCurrentUserOptions,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        createdAt: true,
      },
    });
    const nextCursor = users[limit - 1] ? users[limit - 1].id : undefined;
    res.json({ users, nextCursor });
  } catch (err) {
    next(err);
  }
};
