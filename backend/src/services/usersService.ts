import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { SignUpRequestBody } from "@app/types";

export const createUser = async ({
  username,
  password,
  firstname,
  lastname,
}: SignUpRequestBody) => {
  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      username,
      password: await bcrypt.hash(password, 15),
    },
  });

  return user;
};
