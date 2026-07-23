import { createPost, getPosts } from "../services/postsService.js";
import { matchedData } from "express-validator";
export const getPostsGet = async (req, res, next) => {
    const currentUser = req.currentUser; // for giving the posts of followings
    try {
        const posts = await getPosts({
            include: { user: true },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({ posts });
    }
    catch (err) {
        next(err);
    }
};
export const create = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { title, content, images } = matchedData(req);
    try {
        const post = await createPost({ title, content, images }, currentUserId, {
            include: {
                user: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        username: true,
                        createdAt: true,
                    },
                },
            },
        });
        res.json({ post });
    }
    catch (err) {
        next(err);
    }
};
