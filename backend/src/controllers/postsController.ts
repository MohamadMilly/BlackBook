import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { createPost, getPosts } from "../services/postsService.js";
import { CreatePostRequestBody, Post } from "@app/types";
import { matchedData } from "express-validator";
export const getPostsGet = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.currentUser; // for giving the posts of followings
  try {
    const posts = await getPosts({
      include: { user: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: AuthenticatedRequest<{}, unknown, CreatePostRequestBody>,
  res: Response<{ post: Required<Post> }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id;
  const { title, content, images } = matchedData(req);
  try {
    const post = await createPost(
      { title, content, images },
      currentUserId as number,
      {
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              username: true,
              createdAt: true,
            },
          },
        },
      },
    );
    res.json({ post });
  } catch (err) {
    next(err);
  }
};
