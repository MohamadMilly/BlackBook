import { prisma } from "../lib/prisma.js";
import { HttpError } from "../shared/errors/HttpError.js";
export const createFollowRequest = async (senderId, receiverId, options) => {
    try {
        const followRequest = await prisma.followRequest.create({
            ...options,
            data: {
                senderId,
                receiverId,
            },
        });
        return followRequest;
    }
    catch (err) {
        if (err.code === "P2002") {
            throw new HttpError(400, "Request already sent.");
        }
        else {
            throw err;
        }
    }
};
export const getFollowRequests = async (userId, type, options) => {
    const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (!userExists) {
        throw new HttpError(404, "No User is found.");
    }
    const whereField = type === "received" ? "receiverId" : "senderId";
    const includeField = type === "received" ? "sender" : "receiver";
    return prisma.followRequest.findMany({
        ...options,
        where: {
            [whereField]: userId,
        },
        include: {
            [includeField]: true,
        },
    });
};
export const getFollowRequestsCount = async (userId, type) => {
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
export const acceptRequest = async (userId, requestId) => {
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
    }
    catch (err) {
        if (err.code === "P2025") {
            throw new HttpError(404, "Request does not exist or you are not the receiver.");
        }
        else {
            throw err;
        }
    }
};
export const cancelOrRejectRequest = async (userId, requestId) => {
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
export const unFollowUser = async (userId, userToUnFollowId) => {
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
