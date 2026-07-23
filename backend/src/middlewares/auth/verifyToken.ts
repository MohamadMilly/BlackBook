import { UserJwtPayload } from "@app/types";
import { HttpError } from "../../shared/errors/HttpError.js";

import { verify } from "../../shared/utils/auth/jwt.js";

import type { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../types/index.js";

export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.token;
    if (!token) {
      throw new HttpError(401, "Authentication token required");
    }
    const authData = verify<UserJwtPayload>(token);
    if (authData) {
      req.currentUser = authData;
    }
    next();
  } catch (err: any) {
    if (!err.status) {
      err.status = 401;
    }
    next(err);
  }
}
