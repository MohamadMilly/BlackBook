import { createComment, getPostComments } from "../services/commentsService.js";
export const createCommentPost = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { postId } = req.params;
    const parsedPostId = JSON.parse(postId);
    const { text } = req.body;
    try {
        const comment = await createComment({ text, postId: parsedPostId, userId: currentUserId }, {
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
            },
        });
        res.json({
            comment: comment,
        });
    }
    catch (err) {
        next(err);
    }
};
export const getPostCommentsGet = async (req, res, next) => {
    const { postId } = req.params;
    const parsedPostId = JSON.parse(postId);
    try {
        const comments = await getPostComments(parsedPostId, {
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
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({
            comments: comments,
        });
    }
    catch (err) {
        next(err);
    }
};
