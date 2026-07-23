import express from "express";
import { validateLogin } from "../middlewares/auth/validation/validateLogIn.js";
import { handleValidationErrors } from "../middlewares/shared/handleValidationErrors.js";
import * as authController from "../controllers/authController.js";
import { validateSignUp } from "../middlewares/auth/validation/validateSignUp.js";
export const authRouter = express.Router();
authRouter.post("/login", validateLogin, handleValidationErrors, authController.loginPost);
authRouter.post("/signup", validateSignUp, handleValidationErrors, authController.signUpPost);
authRouter.post("/refresh", authController.refreshTokenPost);
