import { FollowRequestType } from "@app/types";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../shared/errors/HttpError.js";
import { followRequestQueries } from "../queries/followRequest.queries.js";
import { FollowRequestDataResult, FollowRequestsDataResult } from "../types/followRequest.types.js";

export const createFollowRequest = async (
  senderId: number,
  receiverId: number,
): Promise<FollowRequestDataResult> => {
  try {
    if (senderId === receiverId)
      throw new HttpError(400, "Cannot send a follow request for yourself");
    const options = followRequestQueries.createFollowRequest(senderId, receiverId);
    const followRequest = await prisma.followRequest.create({
      ...options,
      data: {
        senderId,
        receiverId,
      },
    });
    return followRequest as FollowRequestDataResult;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new HttpError(400, "Request already sent.");
    } else {
      throw err;
    }
  }
};
export const getFollowRequests = async (
  userId: number,
  type: FollowRequestType,
): Promise<FollowRequestsDataResult> => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!userExists) {
    throw new HttpError(404, "No User is found.");
  }

  const options = followRequestQueries.getFollowRequests(userId, type);
  const requests = await prisma.followRequest.findMany(options);

  return requests as FollowRequestsDataResult;
};

export const getFollowRequestsCount = async (
  userId: number,
  type: "received" | "sent",
): Promise<number> => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!existingUser) {
    throw new HttpError(404, "No User is found.");
  }

  const filterFieldKey = type === "received" ? "receiverId" : "senderId";
  return await prisma.followRequest.count({
    where: {
      [filterFieldKey]: userId,
    },
  });
};

export const acceptRequest = async (
  userId: number,
  requestId: number,
): Promise<boolean> => {
  try {
    const request = await prisma.followRequest.delete({
      where: {
        id: requestId,
        receiverId: userId,
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        followers: {
          connect: {
            id: request.senderId,
          },
        },
      },
    });
    return true;
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new HttpError(
        404,
        "Request does not exist or you are not the receiver.",
      );
    } else {
      throw err;
    }
  }
};

export const cancelOrRejectRequest = async (
  userId: number,
  requestId: number,
): Promise<boolean> => {
  const request = await prisma.followRequest.findUnique({
    where: {
      id: requestId,
    },
  });
  if (request?.senderId !== userId && request?.receiverId !== userId) {
    throw new HttpError(400, "Cannot reject a request you are not a part of.");
  }
  await prisma.followRequest.delete({
    where: {
      id: requestId,
    },
  });
  return true;
};

export const unFollowUser = async (
  userId: number,
  userToUnFollowId: number,
): Promise<boolean> => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      following: {
        disconnect: {
          id: userToUnFollowId,
        },
      },
    },
  });
  return true;
};
