import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { recentStoryWhereOption } from "../shared/queryOptions.js";
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
export const getUser = async (
// pattern 1 : building the query
userId, options) => {
    const include = {};
    if (options.withProfile) {
        include.profile = true;
    }
    if (options.withRecentStoryId) {
        include.posts = { where: recentStoryWhereOption };
    }
    if (options.currentUserId) {
        include.followers = {
            where: {
                id: options.currentUserId,
            },
        };
        include.receivedFollowRequests = {
            where: {
                senderId: options.currentUserId,
            },
        };
    }
    if (options.withFollowCounts) {
        include._count = {
            select: {
                followers: true,
                following: true,
            },
        };
    }
    const user = (await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            createdAt: true,
            profile: true,
            ...(Object.keys(include).length > 0 ? { ...include } : {}),
        },
    }));
    if (!user)
        return;
    const isFollowed = options.currentUserId &&
        "followers" in user &&
        Array.isArray(user.followers)
        ? user.followers.length === 1
        : false;
    const pendingFollowRequest = options.currentUserId &&
        "receivedFollowRequests" in user &&
        Array.isArray(user.receivedFollowRequests)
        ? user.receivedFollowRequests[0]
        : null;
    const { followers, receivedFollowRequests, posts, _count, ...cleanUser } = user;
    return {
        user: cleanUser,
        ...(options.currentUserId
            ? {
                isFollowed: !!isFollowed,
                hasPendingFollowRequest: !!pendingFollowRequest,
                pendingFollowRequest: pendingFollowRequest,
            }
            : {}),
        ...(options.withFollowCounts
            ? {
                followersCount: user._count?.followers ?? 0,
                followingCount: user._count?.following ?? 0,
            }
            : {}),
        ...(options.withRecentStoryId
            ? {
                recentStoryId: user.posts?.[0]?.id ?? null,
            }
            : {}),
    };
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
