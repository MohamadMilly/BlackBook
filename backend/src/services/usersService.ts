import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { SignUpRequestBody, User } from "@app/types";
import {
  UserFindManyArgs,
  UserFindUniqueArgs,
  UserGetPayload,
} from "../generated/prisma/models.js";

export const createUser = async ({
  username,
  password,
  firstname,
  lastname,
}: Omit<SignUpRequestBody, "confirmPassword">) => {
  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      username,
      password: await bcrypt.hash(password, 10),
      profile: { create: {} },
    },
  });

  return user;
};

export const getUser = async <T extends UserFindUniqueArgs>(
  userId: number,
  options: Omit<T, "where"> & { where?: Omit<T["where"], "id"> },
): Promise<UserGetPayload<T>> => {
  const user = await prisma.user.findUnique({
    ...options,
    where: {
      id: userId,
      ...(options?.where ? options.where : {}),
    },
  });

  return user as UserGetPayload<T>;
};

export const getUsers = async <T extends UserFindManyArgs>(
  query: string | undefined,
  cursor: number | undefined,
  limit: number,
  options: T,
): Promise<UserGetPayload<T>[]> => {
  let queryOptions: UserFindManyArgs;
  if (query) {
    const [firstname, lastname] = query.split(" ");

    queryOptions = {
      where: {
        OR: [
          {
            firstname: {
              contains: firstname,
              mode: "insensitive",
            },
          },
          {
            lastname: {
              contains: lastname,
              mode: "insensitive",
            },
          },
        ],
        ...(options.where
          ? {
              ...options.where,
            }
          : {}),
      },
    };
  } else {
    queryOptions = {};
  }
  const users = await prisma.user.findMany({
    ...options,
    ...queryOptions,
    take: limit,
    ...(cursor !== undefined
      ? {
          skip: 1,
          cursor: {
            id: cursor,
          },
        }
      : {}),
  });

  return users as UserGetPayload<T>[];
};

/* 
export const getUserFollowers = async <T extends UserFindUniqueArgs>(
  userId: number,
  options: T,
): Promise<UserGetPayload<T>[]> => {
  const user = await prisma.user.findUnique({
    ...options,
    where: {
      id: userId,
    },
    select: {
      followers: true,
    },
  });

  return user?.followers as UserGetPayload<T>[];
};

export const getUsersFollowings = async <T extends UserFindUniqueArgs>(
  userId: number,
  options: T,
): Promise<UserGetPayload<T>[]> => {
  const user = await prisma.user.findUnique({
    ...options,
    where: {
      id: userId,
    },
    select: {
      following: true,
    },
  });

  return user?.following as UserGetPayload<T>[];
};
*/
export const toggleFollowUser = async (
  followerId: number,
  followedUserId: number,
): Promise<"follow" | "unfollow"> => {
  let operation: "follow" | "unfollow";
  const existingFollower = await prisma.user.findFirst({
    where: {
      id: followerId,
      following: {
        some: {
          id: followedUserId,
        },
      },
    },
  });
  if (existingFollower) {
    await prisma.user.update({
      where: {
        id: followedUserId,
      },
      data: {
        followers: {
          disconnect: {
            id: followerId,
          },
        },
      },
    });
    operation = "unfollow";
  } else {
    await prisma.user.update({
      where: {
        id: followedUserId,
      },
      data: {
        followers: {
          connect: {
            id: followerId,
          },
        },
      },
    });
    operation = "follow";
  }
  return operation;
};
