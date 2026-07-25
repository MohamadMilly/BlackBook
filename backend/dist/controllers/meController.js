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
                user: true,
                likes: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({ posts: posts });
    }
    catch (err) {
        next(err);
    }
};
