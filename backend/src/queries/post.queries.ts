import { CreatePostRequestBody, PostType } from "@app/types";
import {
  PostCreateArgs,
  PostCreateInput,
  PostFindManyArgs,
  PostFindUniqueArgs,
  PostInclude,
  PostWhereInput,
} from "../generated/prisma/models.js";

const sharedPostIncludes = (currentUserId: number) => {
  return {
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
    likes: {
      where: {
        userId: currentUserId,
      },
    },
    _count: {
      select: {
        comments: true,
        likes: true,
      },
    },
  } satisfies PostInclude;
};

export const postQueries = {
  getFeedPosts(currentUserId: number) {
    return {
      where: {
        OR: [
          {
            user: {
              followers: {
                some: {
                  id: currentUserId,
                },
              },
            },
          },
          {
            userId: currentUserId,
          },
        ],
        type: "FEED",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: sharedPostIncludes(currentUserId),
    } satisfies PostFindManyArgs;
  },

  getPosts(currentUserId: number, extraWhere?: PostWhereInput) {
    return {
      where: extraWhere,
      orderBy: {
        createdAt: "desc",
      },
      include: sharedPostIncludes(currentUserId),
    } satisfies PostFindManyArgs;
  },

  getUserPosts(userId: number, type: PostType, currentUserId: number) {
    return {
      where: {
        userId,
        type,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: sharedPostIncludes(currentUserId),
    } satisfies PostFindManyArgs;
  },

  createPost(data: CreatePostRequestBody) {
    return {
      data: data,
      include: { user: { include: { profile: true } } },
    } satisfies PostCreateArgs;
  },

  getPost(postId: number, currentUserId: number) {
    return {
      where: {
        id: postId,
      },
      include: sharedPostIncludes(currentUserId),
    } satisfies PostFindUniqueArgs;
  },
};
