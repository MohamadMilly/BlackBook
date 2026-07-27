import { prisma } from "../lib/prisma.js";
export const getPosts = async (options) => {
    const posts = await prisma.post.findMany(options);
    return posts;
};
export const getUserPosts = async (userId, options) => {
    const posts = await prisma.post.findMany({
        where: {
            userId: userId,
        },
        ...options,
    });
    return posts;
};
export const createPost = async ({ title, images, content }, userId, options) => {
    const post = await prisma.post.create({
        data: {
            title,
            images,
            content,
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
