import {
  FollowRequestCreateArgs,
  FollowRequestFindManyArgs,
  FollowRequestInclude,
} from "../generated/prisma/models.js";

const sharedFollowRequestInclude = {
  sender: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      createdAt: true,
      profile: true,
    },
  },
  receiver: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      createdAt: true,
      profile: true,
    },
  },
} satisfies FollowRequestInclude;

export const followRequestQueries = {
  createFollowRequest(senderId: number, receiverId: number) {
    return {
      data: {
        senderId: senderId,
        receiverId: receiverId,
      },
      include: sharedFollowRequestInclude,
    } satisfies FollowRequestCreateArgs;
  },

  getFollowRequests(userId: number, type: "received" | "sent") {
    const whereField = type === "received" ? "receiverId" : "senderId";

    return {
      where: {
        [whereField]: userId,
      },
      include: sharedFollowRequestInclude,
      orderBy: {
        createdAt: "desc",
      },
    } satisfies FollowRequestFindManyArgs;
  },
};
