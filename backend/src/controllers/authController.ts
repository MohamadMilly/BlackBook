import "dotenv/config";
import {
  LoginRequestBody,
  LoginResponseBody,
  SignUpRequestBody,
  UserJwtPayload,
} from "@app/types";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { HttpError } from "../shared/errors/HttpError.js";
import { sign, verify } from "../shared/utils/auth/jwt.js";
import { matchedData } from "express-validator";
import { createUser } from "../services/usersService.js";
import { JwtPayload } from "jsonwebtoken";
import { googleClient } from "../lib/googleAuth.js";
import { TokenPayload } from "google-auth-library";

export const loginPost = async (
  req: Request<{}, unknown, LoginRequestBody>,
  res: Response<LoginResponseBody>,
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
    const match = await bcrypt.compare(password, user.password); // password , hash

    if (!match) {
      throw new HttpError(400, "Password is incorrect.");
    }
    const payload: UserJwtPayload = {
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
    const payload = verify<JwtPayload>(token);
    const { exp, iat, ...clearnPayLoad } = payload;
    const accessToken = sign(clearnPayLoad, { expiresIn: "15min" });

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

export const authByGooglePost = async (
  req: Request,
  res: Response<LoginResponseBody | { message: string }>,
  next: NextFunction,
) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      message: "idToken is required.",
    });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload() as TokenPayload;

    const {
      given_name,
      family_name,
      picture,
      sub: googleId,
      email,
    } = payload as Required<TokenPayload>;

    let user = await prisma.user.findUnique({
      where: {
        googleId: googleId,
      },
    });
    if (!user) {
      const emailPrefix = email.split("@")[0];
      const cleanPrefix = emailPrefix.replace(/[^a-zA-Z0-9]/g, "");
      const generatedUsername = `${cleanPrefix}_${Math.floor(Math.random() * 9000 + 1000)}`;
      const dummyPassword = await bcrypt.hash(crypto.randomUUID(), 10);

      user = await createUser({
        username: generatedUsername,
        firstname: given_name,
        lastname: family_name,
        googleId: googleId,
        password: dummyPassword,
        avatarUrl: picture,
      });
    }
    const jwtPayload: UserJwtPayload = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.lastname,
    };
    const accessToken: string = sign(jwtPayload, { expiresIn: "15min" });
    const refreshToken: string = sign(jwtPayload, { expiresIn: "7d" });

    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: jwtPayload,
    });
  } catch (err) {
    next(err);
  }
};
