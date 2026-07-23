import { toggleLike } from "../services/likesService.js";
export const toggleLikePost = async (req, res, next) => {
    const currentUser = req.currentUser;
    const { postId } = req.params;
    try {
        const { like, operation } = await toggleLike(currentUser?.id, JSON.parse(postId));
        res.json({ like, operation });
    }
    catch (err) {
        next(err);
    }
};
