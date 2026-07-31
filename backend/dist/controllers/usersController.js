import { getUser, getUsers } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
import { getPostsQueryOptions } from "../shared/queryOptions.js";
export const getUserGet = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { userId } = req.params;
    try {
        const userData = (await getUser(JSON.parse(userId), {
            withFollowCounts: true,
            currentUserId: currentUserId,
            withRecentStoryId: true,
            withProfile: true,
        }));
        if (!userData) {
            res.status(404).json({
                message: "User is not found.",
            });
        }
        res.json({
            ...userData,
        });
    }
    catch (err) {
        next(err);
    }
};
export const getUserPostsGet = async (req, res, next) => {
    const { userId } = req.params;
    const { type } = req.query;
    try {
        const posts = await getUserPosts(JSON.parse(userId), type ?? "FEED", getPostsQueryOptions);
        const postsWithCommentsCounts = posts.map(({ _count, ...post }) => {
            return { ...post, commentsCount: _count.comments };
        });
        res.json({ posts: postsWithCommentsCounts });
    }
    catch (err) {
        next(err);
    }
};
export const getUsersGet = async (req, res, next) => {
    const { search, cursor } = req.query;
    const numCursor = cursor ? JSON.parse(cursor) : undefined;
    const currentUserId = req.currentUser?.id;
    const excludeCurrentUserOptions = currentUserId
        ? {
            where: {
                NOT: {
                    id: currentUserId,
                },
            },
        }
        : {};
    const limit = 30;
    try {
        const users = await getUsers(search, numCursor, limit, {
            ...excludeCurrentUserOptions,
            select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                createdAt: true,
                followers: {
                    where: {
                        id: currentUserId,
                    },
                },
                receivedFollowRequests: {
                    where: {
                        senderId: currentUserId,
                    },
                },
                profile: true,
            },
        });
        const usersWithFollowData = users.map((user) => ({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            createdAt: user.createdAt,
            isFollowed: user.followers.length === 1,
            profile: user.profile,
            hasPendingFollowRequest: user.receivedFollowRequests.length === 1,
        }));
        const nextCursor = users[limit - 1] ? users[limit - 1].id : undefined;
        res.json({ users: usersWithFollowData, nextCursor });
    }
    catch (err) {
        next(err);
    }
};
export const getUserFollowersGet = async (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.currentUser?.id;
    const limit = 30;
    const { search, cursor } = req.query;
    const numCursor = cursor ? JSON.parse(cursor) : undefined;
    try {
        const userFollowers = await getUsers(search, numCursor, limit, {
            where: {
                following: {
                    some: {
                        id: JSON.parse(userId),
                    },
                },
            },
            include: {
                followers: {
                    where: {
                        id: currentUserId,
                    },
                },
                receivedFollowRequests: {
                    where: {
                        senderId: currentUserId,
                    },
                },
                profile: true,
            },
        });
        const userFollowersWithFollowData = userFollowers.map((user) => ({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            createdAt: user.createdAt,
            isFollowed: user.followers.length === 1,
            profile: user.profile,
            hasPendingFollowRequest: user.receivedFollowRequests.length === 1,
        }));
        const nextCursor = userFollowers.length === limit
            ? userFollowers[userFollowers.length - 1].id
            : undefined;
        res.json({
            followers: userFollowersWithFollowData,
            nextCursor,
        });
    }
    catch (err) {
        next(err);
    }
};
export const getUserFollowingsGet = async (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.currentUser?.id;
    const limit = 30;
    const { search, cursor } = req.query;
    const numCursor = cursor ? JSON.parse(cursor) : undefined;
    try {
        const userFollowings = await getUsers(search, numCursor, limit, {
            where: {
                followers: {
                    some: {
                        id: JSON.parse(userId),
                    },
                },
            },
            include: {
                followers: {
                    where: {
                        id: currentUserId,
                    },
                },
                receivedFollowRequests: {
                    where: {
                        senderId: currentUserId,
                    },
                },
                profile: true,
            },
        });
        const userFollowingsWithFollowData = userFollowings.map((user) => ({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            createdAt: user.createdAt,
            isFollowed: user.followers.length === 1,
            profile: user.profile,
            hasPendingFollowRequest: user.receivedFollowRequests.length === 1,
        }));
        const nextCursor = userFollowings.length === limit
            ? userFollowings[userFollowings.length - 1].id
            : undefined;
        res.json({
            followings: userFollowingsWithFollowData,
            nextCursor,
        });
    }
    catch (err) {
        next(err);
    }
};
