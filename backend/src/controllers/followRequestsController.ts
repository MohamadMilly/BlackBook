import { AuthenticatedRequest } from "../types/index.js";
import type { Response, NextFunction } from "express";
import {
  getFollowRequests,
  createFollowRequest,
  getFollowRequestsCount,
  acceptRequest,
  cancelOrRejectRequest,
  unFollowUser,
} from "../services/followRequestsService.js";
import { FollowRequest, FollowRequestType } from "@app/types";
import { HttpError } from "../shared/errors/HttpError.js";

export const createFollowRequestPost = async (
  req: AuthenticatedRequest<{}, unknown, { receiverId: number }>,
  res: Response<{
    request: FollowRequest;
  }>,
  next: NextFunction,
) => {
  const currentUser = req.currentUser;
  const { receiverId } = req.body;

  const request = await createFollowRequest(
    currentUser?.id as number,
    receiverId,
    {
      include: {
        receiver: true,
      },
    },
  );
  res.json({ request });
  try {
  } catch (err) {
    next(err);
  }
};

export const getFollowRequestsGet = async (
  req: AuthenticatedRequest<{}, unknown, {}, { type: FollowRequestType }>,
  res: Response<{
    requests: FollowRequest[];
  }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id;
  const { type } = req.query;
  if (!type) {
    throw new HttpError(404, "Requests type (received,sent) is required");
  }
  try {
    const requests = await getFollowRequests(currentUserId as number, type);
    res.json({
      requests,
    });
  } catch (err) {
    next(err);
  }
};

export const getFollowRequestsCountGet = async (
  req: AuthenticatedRequest<{}, unknown, {}, { type: "received" | "sent" }>,
  res: Response<{ count: number }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id;
  const { type } = req.query;
  try {
    const requestsCount = await getFollowRequestsCount(
      currentUserId as number,
      type,
    );

    res.json({
      count: requestsCount,
    });
  } catch (err) {
    next(err);
  }
};

export const acceptFollowRequestPost = async (
  req: AuthenticatedRequest<{ requestId: string }>,
  res: Response<{ hasAccepted: boolean }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id;
  const { requestId } = req.params;
  try {
    const hasAccepted = await acceptRequest(
      currentUserId as number,
      JSON.parse(requestId),
    );
    res.json({
      hasAccepted,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelOrRejectFollowRequestDelete = async (
  req: AuthenticatedRequest<{ requestId: string }>,
  res: Response<{ hasRemoved: boolean }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id;
  const { requestId } = req.params;
  try {
    const hasRemoved: boolean = await cancelOrRejectRequest(
      currentUserId as number,
      JSON.parse(requestId),
    );
    res.json({ hasRemoved });
  } catch (err) {
    next(err);
  }
};

export const unFollowUserDelete = async (
  req: AuthenticatedRequest<{ userId: string }>,
  res: Response<{ hasUnFollowed: boolean }>,
  next: NextFunction,
) => {
  const currentUserId = req.currentUser?.id as number;
  const { userId } = req.params;
  try {
    const hasUnFollowed = await unFollowUser(currentUserId, JSON.parse(userId));
    res.json({ hasUnFollowed });
  } catch (err) {
    next(err);
  }
};
