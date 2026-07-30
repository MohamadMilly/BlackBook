import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
export const createUser = async ({ username, password, firstname, lastname, googleId, avatarUrl, }) => {
    const user = await prisma.user.create({
        data: {
            firstname,
            lastname,
            googleId,
            username,
            password: await bcrypt.hash(password, 10),
            profile: {
                create: {
                    ...(avatarUrl ? { avatarUrl } : {}),
                },
            },
        },
    });
    return user;
};
export const getUser = async (userId, options) => {
    const user = await prisma.user.findUnique({
        ...options,
        where: {
            id: userId,
            ...(options?.where ? options.where : {}),
        },
    });
    return user;
};
export const getUsers = async (query, cursor, limit, options) => {
    let queryOptions;
    if (query) {
        const searchTerms = query.trim().split(/\s+/);
        queryOptions = {
            where: {
                AND: searchTerms.map((term) => ({
                    OR: [
                        { firstname: { contains: term, mode: "insensitive" } },
                        { lastname: { contains: term, mode: "insensitive" } },
                    ],
                })),
                ...(options.where
                    ? {
                        ...options.where,
                    }
                    : {}),
            },
        };
    }
    else {
        queryOptions = {};
    }
    const users = await prisma.user.findMany({
        ...options,
        ...queryOptions,
        take: limit,
        ...(cursor !== undefined
            ? {
                skip: 1,
                cursor: {
                    id: cursor,
                },
            }
            : {}),
    });
    return users;
};
export const toggleFollowUser = async (followerId, followedUserId) => {
    let operation;
    const existingFollower = await prisma.user.findFirst({
        where: {
            id: followerId,
            following: {
                some: {
                    id: followedUserId,
                },
            },
        },
    });
    if (existingFollower) {
        await prisma.user.update({
            where: {
                id: followedUserId,
            },
            data: {
                followers: {
                    disconnect: {
                        id: followerId,
                    },
                },
            },
        });
        operation = "unfollow";
    }
    else {
        await prisma.user.update({
            where: {
                id: followedUserId,
            },
            data: {
                followers: {
                    connect: {
                        id: followerId,
                    },
                },
            },
        });
        operation = "follow";
    }
    return operation;
};
export const patchProfile = async (userId, data) => {
    return await prisma.profile.update({
        where: {
            userId: userId,
        },
        data: {
            ...data,
        },
    });
};
