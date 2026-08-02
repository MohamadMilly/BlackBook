import { prisma } from "../lib/prisma.js";
import { commentQueries } from "../queries/comment.queries.js";
import {
  CommentDataResult,
  PostCommentsDataResult,
} from "../types/comment.types.js";

export const createComment = async ({
  text,
  postId,
  userId,
}: {
  text: string;
  postId: number;
  userId: number;
}): Promise<CommentDataResult> => {
  const options = commentQueries.createComment({ text, postId, userId });
  const comment = await prisma.comment.create(options);

  return comment;
};

export const getPostComments = async (
  postId: number,
): Promise<PostCommentsDataResult> => {
  const options = commentQueries.getPostComments(postId);
  const comments = await prisma.comment.findMany(options);

  return comments;
};
