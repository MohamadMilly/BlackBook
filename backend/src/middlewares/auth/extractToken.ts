import type { Response, NextFunction, Request } from "express";

/* import { AuthenticatedRequest } from "../types/index.js"; 
we can add this when we want to determine the currentUser attached to the req object
*/

export function extractToken(
  req: Request & { token: string },
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
