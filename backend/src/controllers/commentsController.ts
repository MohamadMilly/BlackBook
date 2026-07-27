import type { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { createComment, getPostComments } from "../services/commentsService.js";
import { Comment } from "@app/types";

export const createCommentPost = async (
  req: AuthenticatedRequest<{ postId: string }, unknown, { text: string }>,
  res: Response<{ comment: Comment }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;
  const { postId } = req.params;
  const parsedPostId = JSON.parse(postId);
  const { text } = req.body;
  try {
    const comment: Comment = await createComment(
      { text, postId: parsedPostId, userId: currentUserId },
      {
        include: {
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
        },
      },
    );

    res.json({
      comment: comment,
    });
  } catch (err) {
    next(err);
  }
};

export const getPostCommentsGet = async (
  req: Request<{ postId: string }>,
  res: Response<{ comments: Comment[] }>,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const parsedPostId: number = JSON.parse(postId);
  try {
    const comments = await getPostComments(parsedPostId, {
      include: {
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      comments: comments,
    });
  } catch (err) {
    next(err);
  }
};
