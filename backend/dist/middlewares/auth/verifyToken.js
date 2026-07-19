import { HttpError } from "../../shared/errors/HttpError.js";
// import { AuthenticatedRequest } from "../types/index.js";
// import { User } from "@app/types";
import { verify } from "../../shared/utils/auth/jwt.js";
// replace any with a custom or native Request type
export function verifyToken(req, res, next) {
    try {
        const token = req.token;
        if (!token) {
            throw new HttpError(401, "Authentication token required");
        }
        const authData = verify(token); // add type here (User commonly)
        if (authData) {
            req.currentUser = authData;
        }
        next();
    }
    catch (err) {
        if (!err.status) {
            err.status = 401;
        }
        next(err);
    }
}
