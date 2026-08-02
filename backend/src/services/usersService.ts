import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { SignUpRequestBody } from "@app/types";
import {
  ProfileUpdateInput,
  UserWhereInput,
} from "../generated/prisma/models.js";
import { userQueries } from "../queries/user.queries.js";
import { UserDataResult, UsersDataResult } from "../types/user.types.js";

export const createUser = async ({
  username,
  password,
  firstname,
  lastname,
  googleId,
  avatarUrl,
}: Omit<SignUpRequestBody, "confirmPassword"> & { avatarUrl?: string }) => {
  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      googleId,
      username,
      password: await bcrypt.hash(password, 10),
      profile: {
        create: {
          ...(avatarUrl ? { avatarUrl } : {}),
        },
      },
    },
  });

  return user;
};

export const getUser = async (
  userId: number,
  currentUserId: number,
): Promise<UserDataResult> => {
  const getUserQuery = userQueries.getUser(userId, currentUserId);
  const userData = await prisma.user.findUnique(getUserQuery);

  return userData;
};

export const getUsers = async (
  query: string | undefined,
  cursor: number | undefined,
  limit: number,
  currentUserId: number,
  extraWhere?: UserWhereInput,
): Promise<UsersDataResult> => {
  const usersQuery = userQueries.getUsers(
    query,
    limit,
    cursor,
    currentUserId,
    extraWhere,
  );
  const users = await prisma.user.findMany(usersQuery);

  return users;
};

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

export const patchProfile = async (
  userId: number,
  data: ProfileUpdateInput,
) => {
  return await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      ...data,
    },
  });
};
