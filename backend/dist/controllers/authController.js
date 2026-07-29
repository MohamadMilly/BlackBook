import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { HttpError } from "../shared/errors/HttpError.js";
import { sign, verify } from "../shared/utils/auth/jwt.js";
import { matchedData } from "express-validator";
import { createUser } from "../services/usersService.js";
import { googleClient } from "../lib/googleAuth.js";
export const loginPost = async (req, res, next) => {
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
        const payload = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
        };
        const accessToken = sign(payload, { expiresIn: "15min" });
        const RefreshToken = sign(payload, { expiresIn: "7d" });
        res.json({
            accessToken: accessToken,
            refreshToken: RefreshToken,
            user: payload,
        });
    }
    catch (err) {
        next(err);
    }
};
export const refreshTokenPost = async (req, res, next) => {
    const { refreshToken: token } = req.body;
    try {
        const payload = verify(token);
        const { exp, iat, ...clearnPayLoad } = payload;
        const accessToken = sign(clearnPayLoad, { expiresIn: "15min" });
        res.json({
            accessToken: accessToken,
        });
    }
    catch (err) {
        next(err);
    }
};
export const signUpPost = async (req, res, next) => {
    const { firstname, lastname, username, password } = matchedData(req);
    try {
        const user = await createUser({ firstname, lastname, username, password });
        const { password: _, ...userWithOutPassword } = user;
        res.json({
            message: "Created Account successfully.",
            user: userWithOutPassword,
        });
    }
    catch (err) {
        next(err);
    }
};
export const authByGooglePost = async (req, res, next) => {
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
        const payload = ticket.getPayload();
        const { given_name, family_name, picture, sub: googleId, email, } = payload;
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
        const jwtPayload = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.lastname,
        };
        const accessToken = sign(jwtPayload, { expiresIn: "15min" });
        const refreshToken = sign(jwtPayload, { expiresIn: "7d" });
        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: jwtPayload,
        });
    }
    catch (err) {
        next(err);
    }
};
