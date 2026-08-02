import { PromiseReturnType } from "@prisma/client/extension";
import { postQueries } from "../queries/post.queries.js";
import { prisma } from "../lib/prisma.js";

type GetPostQueryArgs = ReturnType<typeof postQueries.getPost>;
type GetPostsQueryArgs = ReturnType<typeof postQueries.getPosts>;
type GetUserPostsQueryArgs = ReturnType<typeof postQueries.getUserPosts>;
type CreatePostQueryArgs = ReturnType<typeof postQueries.createPost>;

export type PostDataResult = PromiseReturnType<
  typeof prisma.post.findUnique<GetPostQueryArgs>
>;

export type PostsDataResult = PromiseReturnType<
  typeof prisma.post.findMany<GetPostsQueryArgs>
>;

export type UserPostsDataResult = PromiseReturnType<
  typeof prisma.post.findMany<GetUserPostsQueryArgs>
>;

export type SafePostDataResult = Exclude<PostDataResult, null>;
export type CreatedPostDataResult = PromiseReturnType<
  typeof prisma.post.create<CreatePostQueryArgs>
>;
