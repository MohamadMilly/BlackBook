import {
  UserFindManyArgs,
  UserFindUniqueArgs,
  UserInclude,
  UserWhereInput,
} from "../generated/prisma/models.js";

export const userSharedIncludes = (currentUserId: number) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
    receivedFollowRequests: {
      where: {
        senderId: currentUserId,
      },
    },
    followers: {
      where: {
        id: currentUserId,
      },
    },
    profile: true,
    posts: {
      where: {
        createdAt: {
          gt: yesterday,
        },
      },
    },
  } satisfies UserInclude;
};

export const userQueries = {
  getUser(userId: number, currentUserId: number) {
    const include = userSharedIncludes(currentUserId);
    const { receivedFollowRequests, followers, ...currentUserInclude } =
      include;
    if (currentUserId === userId) {
      return {
        where: {
          id: userId,
        },
        include: currentUserInclude,
      } satisfies UserFindUniqueArgs;
    }
    return {
      where: {
        id: userId,
      },
      include: include,
    } satisfies UserFindUniqueArgs;
  },

  getUsers(
    search: string | undefined,
    limit: number,
    cursor: number | undefined,
    currentUserId: number,
    extraWhere?: UserWhereInput,
  ) {
    let searchOptions = {};
    if (search) {
      const searchTerms = search.trim().split(" ").filter(Boolean);

      searchOptions = {
        AND: searchTerms.map((term) => ({
          OR: [
            { firstname: { contains: term, mode: "insensitive" } },
            { lastname: { contains: term, mode: "insensitive" } },
          ],
        })),
      };
    }

    return {
      where: { ...searchOptions, ...extraWhere },
      include: userSharedIncludes(currentUserId),
      take: limit,
      ...(cursor !== undefined
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
    } satisfies UserFindManyArgs;
  },
};
