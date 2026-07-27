import { prisma } from "../lib/prisma.js";
export const createComment = async ({ text, postId, userId }, options) => {
    const comment = await prisma.comment.create({
        ...options,
        data: {
            text,
            postId,
            userId,
        },
    });
    return comment;
};
export const getPostComments = async (postId, options) => {
    const comments = await prisma.comment.findMany({
        ...options,
        where: {
            postId: postId,
            ...(options.where ? options.where : {}),
        },
    });
    return comments;
};
