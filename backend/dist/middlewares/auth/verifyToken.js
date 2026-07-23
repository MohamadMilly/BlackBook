import { HttpError } from "../../shared/errors/HttpError.js";
import { verify } from "../../shared/utils/auth/jwt.js";
export function verifyToken(req, res, next) {
    try {
        const token = req.token;
        if (!token) {
            throw new HttpError(401, "Authentication token required");
        }
        const authData = verify(token);
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
