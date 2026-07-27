import { prisma } from "../lib/prisma.js";
import {
  PostCreateArgs,
  PostFindManyArgs,
  PostGetPayload,
} from "../generated/prisma/models.js";
import { CreatePostRequestBody, Post } from "@app/types";

export const getPosts = async <T extends PostFindManyArgs>(
  options: T,
): Promise<PostGetPayload<T>[]> => {
  const posts = await prisma.post.findMany(options);

  return posts as PostGetPayload<T>[];
};

export const getUserPosts = async <T extends PostFindManyArgs>(
  userId: number,
  options: T,
): Promise<PostGetPayload<T>[]> => {
  const posts = await prisma.post.findMany({
    where: {
      userId: userId,
    },
    ...options,
  });

  return posts as PostGetPayload<T>[];
};

export const createPost = async <T extends Omit<PostCreateArgs, "data">>(
  { title, images, content }: CreatePostRequestBody,
  userId: number,
  options: T,
): Promise<
  PostGetPayload<T>
> /* better for typing the result based on options */ => {
  const post = await prisma.post.create({
    data: {
      title,
      images,
      content,
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
