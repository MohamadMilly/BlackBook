import type { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { createComment, getPostComments } from "../services/commentsService.js";
import { Comment } from "@app/types";
import { commentPresenters } from "../presenters/comment.presenter.js";

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
    const comment = await createComment({
      text,
      postId: parsedPostId,
      userId: currentUserId,
    });

    res.json({
      comment: commentPresenters.presentComment(comment),
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
    const comments = await getPostComments(parsedPostId);
    res.json({
      comments: commentPresenters.presentCommentsList(comments),
    });
  } catch (err) {
    next(err);
  }
};
