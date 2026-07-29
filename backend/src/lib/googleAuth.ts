import "dotenv/config";
import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID in environment variables");
}

export const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
