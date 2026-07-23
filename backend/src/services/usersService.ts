import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { SignUpRequestBody } from "@app/types";
import {
  UserFindFirstArgs,
  UserFindManyArgs,
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
      password: await bcrypt.hash(password, 15),
    },
  });

  return user;
};

export const getUser = async (
  userId: number,
  options: Record<string, any> = {},
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    ...options,
  });

  return user;
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
