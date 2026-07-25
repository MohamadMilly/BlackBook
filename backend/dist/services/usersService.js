import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
export const createUser = async ({ username, password, firstname, lastname, }) => {
    const user = await prisma.user.create({
        data: {
            firstname,
            lastname,
            username,
            password: await bcrypt.hash(password, 15),
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
        const [firstname, lastname] = query.split(" ");
        queryOptions = {
            where: {
                OR: [
                    {
                        firstname: {
                            contains: firstname,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastname: {
                            contains: lastname,
                            mode: "insensitive",
                        },
                    },
                ],
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
export const getUserFollowers = async (userId, options) => {
    const user = await prisma.user.findUnique({
        ...options,
        where: {
            id: userId,
        },
        select: {
            followers: true,
        },
    });
    return user?.followers;
};
export const getUsersFollowings = async (userId, options) => {
    const user = await prisma.user.findUnique({
        ...options,
        where: {
            id: userId,
        },
        select: {
            following: true,
        },
    });
    return user?.following;
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
