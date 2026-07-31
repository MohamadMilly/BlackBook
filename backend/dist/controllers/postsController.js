import { createPost, getPost, getPosts, watchPost, } from "../services/postsService.js";
import { matchedData } from "express-validator";
import { getPostsQueryOptions } from "../shared/queryOptions.js";
export const getPostsGet = async (req, res, next) => {
    const currentUser = req.currentUser; // for giving the posts of followings
    try {
        const posts = await getPosts({
            where: {
                OR: [
                    {
                        user: {
                            followers: {
                                some: {
                                    id: currentUser?.id,
                                },
                            },
                        },
                    },
                    {
                        userId: currentUser?.id,
                    },
                ],
                type: "FEED",
            },
            ...getPostsQueryOptions,
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
    const { title, content, images, type } = matchedData(req);
    try {
        const post = await createPost({ title, content, images, type }, currentUserId, {
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
export const getPostGet = async (req, res, next) => {
    const { postId } = req.params;
    try {
        let post = await getPost(JSON.parse(postId), {
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
                likes: true, // this is only if the likes are not very much
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });
        const { _count, ...postWithCommentCount } = {
            ...post,
            commentsCount: post._count.comments,
        };
        res.json({ post: postWithCommentCount });
    }
    catch (err) {
        next(err);
    }
};
export const watch = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const hasBeenWatched = await watchPost(JSON.parse(postId));
        return res.json({
            hasBeenWatched: hasBeenWatched,
        });
    }
    catch (err) {
        next(err);
    }
};
