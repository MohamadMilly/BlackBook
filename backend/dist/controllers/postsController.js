import { createPost, getPosts } from "../services/postsService.js";
import { matchedData } from "express-validator";
export const getPostsGet = async (req, res, next) => {
    const currentUser = req.currentUser; // for giving the posts of followings
    try {
        const posts = await getPosts({
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                likes: true /* here we can only get the user like and return hasLiked instead of getting all likes and check in frontend
              / but it is okay if likes are not so much */,
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
                        profile: true,
                    },
                },
                likes: true,
            },
        });
        res.json({ post: { ...post, commentsCount: 0 } });
    }
    catch (err) {
        next(err);
    }
};
