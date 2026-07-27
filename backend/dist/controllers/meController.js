import { getUser } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
const getCurrentUserGet = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    try {
        const user = (await getUser(currentUserId, {
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
                profile: true,
            },
        }));
        if (!user) {
            res.status(404).json({
                message: "User is not found.",
            });
        }
        else {
            res.json({
                user: user,
                followersCount: user._count.followers,
                followingCount: user._count.following,
            });
        }
    }
    catch (err) {
        next(err);
    }
};
export { getCurrentUserGet };
export const getCurrentUserPosts = async (req, res, next) => {
    const currentUser = req.currentUser;
    try {
        const posts = await getUserPosts(currentUser?.id, {
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                likes: true,
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const postsWithCommentsCounts = posts.map(({ _count, ...post }) => ({
            ...post,
            commentsCount: _count.comments,
        }));
        res.json({ posts: postsWithCommentsCounts });
    }
    catch (err) {
        next(err);
    }
};
