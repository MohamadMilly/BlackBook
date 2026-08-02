import { PromiseReturnType } from "@prisma/client/extension";
import { prisma } from "../lib/prisma.js";
import { commentQueries } from "../queries/comment.queries.js";

type CreateCommentQueryArgs = ReturnType<typeof commentQueries.createComment>;
type GetPostCommentsQueryArgs = ReturnType<typeof commentQueries.getPostComments>;

export type CommentDataResult = PromiseReturnType<
  typeof prisma.comment.create<CreateCommentQueryArgs>
>;

export type PostCommentsDataResult = PromiseReturnType<
  typeof prisma.comment.findMany<GetPostCommentsQueryArgs>
>;
