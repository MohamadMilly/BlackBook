import { prisma } from "../lib/prisma.js";
import {
  PostCreateArgs,
  PostFindManyArgs,
  PostFindUniqueArgs,
  PostGetPayload,
} from "../generated/prisma/models.js";
import { CreatePostRequestBody, PostType } from "@app/types";
import { HttpError } from "../shared/errors/HttpError.js";

export const getPosts = async <T extends PostFindManyArgs>(
  options: T,
): Promise<PostGetPayload<T>[]> => {
  const posts = await prisma.post.findMany(options);

  return posts as PostGetPayload<T>[];
};

export const getUserPosts = async <T extends PostFindManyArgs>(
  userId: number,
  type: PostType,
  options: T,
): Promise<PostGetPayload<T>[]> => {
  const posts = await prisma.post.findMany({
    where: {
      userId: userId,
      type: type,
    },
    ...options,
  });

  return posts as PostGetPayload<T>[];
};

export const createPost = async <T extends Omit<PostCreateArgs, "data">>(
  { title, images, content, type }: CreatePostRequestBody,
  userId: number,
  options: T,
): Promise<
  PostGetPayload<T>
> /* better for typing the result based on options */ => {
  if (type === "STORY") {
    // cannot create two stories at once  (the time diff should be at least one day)

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const existingRecentStory = await prisma.post.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gt: yesterday,
        },
        type: "STORY",
      },
    });
    if (existingRecentStory) {
      throw new HttpError(
        400,
        "There is already an existing recent story. try to delete the last story first.",
      );
    }
  }
  const post = await prisma.post.create({
    data: {
      title,
      images,
      content,
      type,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    ...options,
  });

  return post as PostGetPayload<T>;
};

export const getPost = async <T extends Omit<PostFindUniqueArgs, "where">>(
  postId: number,
  options?: T,
): Promise<PostGetPayload<T>> => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    ...options,
  });

  return post as PostGetPayload<T>;
};

export const watchPost = async (postId: number): Promise<boolean> => {
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
  return true;
};
