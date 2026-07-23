import { getUser, getUsers } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
export const getUserGet = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await getUser(JSON.parse(userId));
        res.json({
            user: user,
        });
    }
    catch (err) {
        next(err);
    }
};
export const getUserPostsGet = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const posts = await getUserPosts(JSON.parse(userId), {
            include: {
                user: true,
                likes: true,
            },
        });
        res.json({ posts });
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
    const limit = 3;
    try {
        const users = await getUsers(search, numCursor, limit, {
            ...excludeCurrentUserOptions,
            select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                createdAt: true,
            },
        });
        const nextCursor = users[limit - 1] ? users[limit - 1].id : undefined;
        res.json({ users, nextCursor });
    }
    catch (err) {
        next(err);
    }
};
