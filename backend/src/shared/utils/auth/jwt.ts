import "dotenv/config";
import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import { HttpError } from "../../errors/HttpError.js";

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  console.warn(
    "WARNING: SECRET_KEY env variable missing. Using unsafe fallback.",
  );
}
const SAFE_SECRET = SECRET_KEY ?? "fallback-custom-key";

export function sign(
  payload: string | object | Buffer,
  options: SignOptions = {},
): string {
  return jwt.sign(payload, SAFE_SECRET, options);
}

export function verify<T extends object = Record<string, unknown>>(
  token: string,
  options: VerifyOptions = {},
): T & JwtPayload {
  try {
    const decoded = jwt.verify(token, SAFE_SECRET, {
      clockTolerance: 60,
      ...options,
    });

    if (typeof decoded === "string") {
      throw new Error("Token payload is a raw string, expected an object.");
    }

    return decoded as T & JwtPayload;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Token invalid or expired";
    throw new HttpError(401, `Unauthorized: ${message}`);
  }
}
