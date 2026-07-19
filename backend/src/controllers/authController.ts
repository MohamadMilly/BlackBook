import { LoginRequestBody, SignUpRequestBody } from "@app/types";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { HttpError } from "../shared/errors/HttpError.js";
import { sign, verify } from "../shared/utils/auth/jwt.js";
import { matchedData } from "express-validator";
import { createUser } from "../services/usersService.js";

export const loginPost = async (
  req: Request<{}, unknown, LoginRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = matchedData(req);
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new HttpError(400, "User with this username does not exist.");
    }
    const match = await bcrypt.compare(user.password, password);
    if (!match) {
      throw new HttpError(400, "Password is incorrect.");
    }
    const payload = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
    };
    const accessToken: string = sign(payload, { expiresIn: "15min" });
    const RefreshToken: string = sign(payload, { expiresIn: "7d" });

    res.json({
      accessToken: accessToken,
      refreshToken: RefreshToken,
      user: payload,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenPost = async (
  req: Request<{}, unknown, { refreshToken: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken: token } = req.body;
  try {
    const payload = verify(token);
    const accessToken = sign(payload, { expiresIn: "15min" });

    res.json({
      accessToken: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const signUpPost = async (
  req: Request<{}, unknown, SignUpRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { firstname, lastname, username, password } = matchedData(req);
  try {
    const user = await createUser({ firstname, lastname, username, password });
    const { password: _, ...userWithOutPassword } = user;
    res.json({
      message: "Created Account successfully.",
      user: userWithOutPassword,
    });
  } catch (err) {
    next(err);
  }
};
