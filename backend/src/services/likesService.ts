import { Like, ToggleLikeResponseBody } from "@app/types";
import { prisma } from "../lib/prisma.js";

export const toggleLike = async (
  userId: number,
  postId: number,
): Promise<ToggleLikeResponseBody> => {
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
  } catch (err: any) {
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
    } else {
      throw err;
    }
  }
};
