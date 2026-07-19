import express from "express";
import "dotenv/config";
import cors from "cors";
import { HttpError } from "./shared/errors/HttpError.js";
// routers
import { authRouter } from "./routes/authRouter.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use((req, res, next) => {
    const routeError = new HttpError(404, "Route is not found.");
    next(routeError);
});
app.use((err, req, res, next) => {
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
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error running the server: ", err);
        return;
    }
    console.log("Server is running on port: ", PORT);
});
