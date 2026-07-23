import { UserJwtPayload } from "@app/types";
import type { Request } from "express";

export interface AuthenticatedRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  token?: string;
  currentUser?: UserJwtPayload;
}
