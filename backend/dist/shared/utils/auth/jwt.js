import "dotenv/config";
import jwt from "jsonwebtoken";
import { HttpError } from "../../errors/HttpError.js";
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    console.warn("WARNING: SECRET_KEY env variable missing. Using unsafe fallback.");
}
const SAFE_SECRET = SECRET_KEY ?? "fallback-custom-key";
export function sign(payload, options = {}) {
    return jwt.sign(payload, SAFE_SECRET, options);
}
export function verify(token, options = {}) {
    try {
        const decoded = jwt.verify(token, SAFE_SECRET, {
            clockTolerance: 60,
            ...options,
        });
        if (typeof decoded === "string") {
            throw new Error("Token payload is a raw string, expected an object.");
        }
        return decoded;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Token invalid or expired";
        throw new HttpError(401, `Unauthorized: ${message}`);
    }
}
