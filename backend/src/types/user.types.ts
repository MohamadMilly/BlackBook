import { PromiseReturnType } from "@prisma/client/extension";
import { userQueries } from "../queries/user.queries.js";
import { prisma } from "../lib/prisma.js";

// for services input query and output

type GetUserQueryArgs = ReturnType<typeof userQueries.getUser>;

export type UserDataResult = PromiseReturnType<
  typeof prisma.user.findUnique<GetUserQueryArgs>
>;

export type SafeUserDataResult = Exclude<UserDataResult, null>;

type GetUsersQueryArgs = ReturnType<typeof userQueries.getUsers>;

export type UsersDataResult = PromiseReturnType<
  typeof prisma.user.findMany<GetUsersQueryArgs>
>;
