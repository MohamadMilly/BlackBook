import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types/index.js";

export function extractToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
  }

  next();
}
