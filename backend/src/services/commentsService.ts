import {
  CommentCreateArgs,
  CommentFindManyArgs,
  CommentGetPayload,
} from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";

export const createComment = async <T extends Omit<CommentCreateArgs, "data">>(
  { text, postId, userId }: { text: string; postId: number; userId: number },
  options: T,
): Promise<CommentGetPayload<T>> => {
  const comment = await prisma.comment.create({
    ...options,
    data: {
      text,
      postId,
      userId,
    },
  });

  return comment as CommentGetPayload<T>;
};

export const getPostComments = async <T extends CommentFindManyArgs>(
  postId: number,
  options: T,
): Promise<CommentGetPayload<T>[]> => {
  const comments = await prisma.comment.findMany({
    ...options,
    where: {
      postId: postId,
      ...(options.where ? options.where : {}),
    },
  });

  return comments as CommentGetPayload<T>[];
};
