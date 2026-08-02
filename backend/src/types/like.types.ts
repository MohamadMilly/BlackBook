import { PromiseReturnType } from "@prisma/client/extension";
import { prisma } from "../lib/prisma.js";

export type LikeDataResult = PromiseReturnType<typeof prisma.like.create>;
export type DeletedLikeDataResult = PromiseReturnType<typeof prisma.like.delete>;
