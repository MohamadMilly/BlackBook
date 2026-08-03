import { prisma } from "../lib/prisma.js";
import { CreatePostRequestBody, PostType } from "@app/types";
import { HttpError } from "../shared/errors/HttpError.js";
import {
  CreatedPostDataResult,
  PostDataResult,
  PostsDataResult,
} from "../types/post.types.js";
import { postQueries } from "../queries/post.queries.js";

export const getPosts = async (
  currentUserId: number,
): Promise<PostsDataResult> => {
  const options = postQueries.getFeedPosts(currentUserId);
  const posts = await prisma.post.findMany(options);

  return posts as PostsDataResult;
};

export const getUserPosts = async (
  userId: number,
  type: PostType,
  currentUserId: number,
): Promise<PostsDataResult> => {
  const userPostsQuery = postQueries.getUserPosts(userId, type, currentUserId);
  const posts = await prisma.post.findMany(userPostsQuery);

  return posts;
};

export const createPost = async (
  userId: number,
  { title, images, content, type }: CreatePostRequestBody,
): Promise<CreatedPostDataResult> => {
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
  const createPostQuery = postQueries.createPost({
    title,
    images,
    content,
    type,
    user: { connect: { id: userId } },
  });
  const post = await prisma.post.create(createPostQuery);

  return post;
};

export const getPost = async (
  postId: number,
  currentUserId: number,
): Promise<PostDataResult> => {
  const options = postQueries.getPost(postId, currentUserId);
  const post = await prisma.post.findUnique(options);

  return post;
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
