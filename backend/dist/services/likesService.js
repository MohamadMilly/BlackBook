import { prisma } from "../lib/prisma.js";
export const toggleLike = async (userId, postId) => {
    const filter = {
        userId_postId: {
            userId: userId,
            postId: postId,
        },
    };
    try {
        await prisma.like.delete({
            where: filter,
        });
        return { operation: "delete", like: null };
    }
    catch (err) {
        if (err.code === "P2025") {
            const like = await prisma.like.create({
                data: {
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    post: {
                        connect: {
                            id: postId,
                        },
                    },
                },
            });
            return { operation: "create", like: like };
        }
        else {
            throw err;
        }
    }
};
