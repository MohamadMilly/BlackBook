import { prisma } from "../lib/prisma.js";
import { HttpError } from "../shared/errors/HttpError.js";
export const getPosts = async (options) => {
    const posts = await prisma.post.findMany(options);
    return posts;
};
export const getUserPosts = async (userId, type, options) => {
    const posts = await prisma.post.findMany({
        where: {
            userId: userId,
            type: type,
        },
        ...options,
    });
    return posts;
};
export const createPost = async ({ title, images, content, type }, userId, options) => {
    if (type === "STORY") {
        // cannot create two stories at once  (the time diff should be at least one day)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const existingRecentStory = await prisma.post.findFirst({
            where: {
                createdAt: {
                    gt: yesterday,
                },
                type: "STORY",
            },
        });
        if (existingRecentStory) {
            throw new HttpError(400, "There is already an existing recent story. try to delete the last story first.");
        }
    }
    const post = await prisma.post.create({
        data: {
            title,
            images,
            content,
            type,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
        ...options,
    });
    return post;
};
export const getPost = async (postId, options) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        ...options,
    });
    return post;
};
export const watchPost = async (postId) => {
    await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            views: {
                increment: 1,
            },
        },
    });
    return true;
};
