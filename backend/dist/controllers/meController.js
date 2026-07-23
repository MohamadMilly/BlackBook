import { getUser } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
const getCurrentUserGet = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    try {
        const user = await getUser(currentUserId);
        if (!user) {
            res.json({
                message: "User is not found.",
            });
        }
        else {
            res.json({ user: user });
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
            },
        });
        res.json({ posts: posts });
    }
    catch (err) {
        next(err);
    }
};
