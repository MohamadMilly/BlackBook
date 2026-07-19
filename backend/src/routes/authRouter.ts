import express, { Router } from "express";
import { validateLogin } from "../middlewares/auth/validation/validateLogIn.js";
import { handleValidationErrors } from "../middlewares/auth/validation/handleValidationErrors.js";
import {
  loginPost,
  refreshTokenPost,
  signUpPost,
} from "../controllers/authController.js";
import { validateSignUp } from "../middlewares/auth/validation/validateSignUp.js";

export const authRouter: Router = express.Router();

authRouter.post("/login", validateLogin, handleValidationErrors, loginPost);
authRouter.post("/signup", validateSignUp, handleValidationErrors, signUpPost);
authRouter.post("/refresh", refreshTokenPost);
