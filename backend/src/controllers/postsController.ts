import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import {
  createPost,
  getPost,
  getPosts,
  watchPost,
} from "../services/postsService.js";
import {
  CreatePostRequestBody,
  CreatePostResponseBody,
  GetPostResponseBody,
  GetPostsResponseBody,
  Post,
} from "@app/types";
import { matchedData } from "express-validator";
import { postPresenters } from "../presenters/post.presenter.js";

export const getPostsGet = async (
  req: AuthenticatedRequest,
  res: Response<GetPostsResponseBody>,
  next: NextFunction,
) => {
  const currentUser = req.currentUser;
  try {
    const posts = await getPosts(currentUser?.id as number);
    const formattedPosts = postPresenters.presentPostsList(posts);
    res.json({ posts: formattedPosts });
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: AuthenticatedRequest<{}, unknown, CreatePostRequestBody>,
  res: Response<CreatePostResponseBody>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;
  const { title, content, images, type } = matchedData(req);
  try {
    const post = await createPost({
      title,
      content,
      images,
      type,
      userId: currentUserId,
    });
    const initialPostType: Required<Post> = {
      ...post,
      commentsCount: 0,
      isLiked: false,
      likesCount: 0,
    };
    res.json({ post: initialPostType });
  } catch (err) {
    next(err);
  }
};

export const getPostGet = async (
  req: AuthenticatedRequest<{ postId: string }>,
  res: Response<GetPostResponseBody | { message: string }>,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const numUserId = Number(postId);
  const currentUserId = req.currentUser?.id as number;
  try {
    const post = await getPost(numUserId, currentUserId);
    if (!post) {
      res.json({ message: "Post is not found." });
      return;
    }
    res.json({ post: postPresenters.presentPost(post) });
  } catch (err) {
    next(err);
  }
};

export const watch = async (
  req: AuthenticatedRequest<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const numUserId = Number(postId);
  try {
    const hasBeenWatched = await watchPost(numUserId);
    return res.json({
      hasBeenWatched: hasBeenWatched,
    });
  } catch (err) {
    next(err);
  }
};
