import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { HttpError } from "./shared/errors/HttpError.js";

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const routeError = new HttpError(404, "Route is not found.");
  next(routeError);
});
app.use(
  (
    err: any,
    req: Request,
    res: Response<{ message: string }>,
    next: NextFunction,
  ) => {
    let status = err.status;
    let message = err.message;
    if (!status) {
      status = 500;
    }
    if (!message) {
      message = "Unexpected server error has occured";
    }
    res.status(status).json({
      message: message,
      ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    });
  },
);
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error("Error running the server: ", err);
    return;
  }
  console.log("Server is running on port: ", PORT);
});
