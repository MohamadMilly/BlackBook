import { getUser, patchProfile } from "../services/usersService.js";
import { getUserPosts } from "../services/postsService.js";
import { getPostsQueryOptions } from "../shared/queryOptions.js";
const getCurrentUserGet = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    try {
        const userData = (await getUser(currentUserId, {
            withProfile: true,
            withRecentStoryId: true,
            withFollowCounts: true,
        }));
        if (!userData) {
            res.status(404).json({
                message: "User is not found.",
            });
        }
        else {
            res.json({
                ...userData,
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
    const { type } = req.query;
    try {
        const posts = await getUserPosts(currentUser?.id, type ?? "FEED", getPostsQueryOptions);
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
export const patchProfilePatch = async (req, res, next) => {
    const data = req.body;
    const currentUserId = req.currentUser?.id;
    try {
        const updatedProfile = await patchProfile(currentUserId, data);
        res.json({ profile: updatedProfile });
    }
    catch (err) {
        next(err);
    }
};
