import { CreateCommentInput } from "@app/types";
import {
  CommentCreateArgs,
  CommentCreateInput,
  CommentFindManyArgs,
  CommentInclude,
} from "../generated/prisma/models.js";

const sharedCommentInclude = {
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
} satisfies CommentInclude;

export const commentQueries = {
  createComment({ text, postId, userId }: CreateCommentInput) {
    return {
      data: {
        text: text,
        postId: postId,
        userId: userId,
      },
      include: sharedCommentInclude,
    } satisfies CommentCreateArgs;
  },

  getPostComments(postId: number) {
    return {
      where: {
        postId,
      },
      include: sharedCommentInclude,
      orderBy: {
        createdAt: "desc",
      },
    } satisfies CommentFindManyArgs;
  },
};
