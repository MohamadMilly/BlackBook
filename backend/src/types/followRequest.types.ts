import { PromiseReturnType } from "@prisma/client/extension";
import { prisma } from "../lib/prisma.js";
import { followRequestQueries } from "../queries/followRequest.queries.js";

type CreateFollowRequestQueryArgs = ReturnType<
  typeof followRequestQueries.createFollowRequest
>;
type GetFollowRequestsQueryArgs = ReturnType<
  typeof followRequestQueries.getFollowRequests
>;

export type FollowRequestDataResult = PromiseReturnType<
  typeof prisma.followRequest.create<CreateFollowRequestQueryArgs>
>;

export type FollowRequestsDataResult = PromiseReturnType<
  typeof prisma.followRequest.findMany<GetFollowRequestsQueryArgs>
>;
