import { body } from "express-validator";
const loginUsernameCheck = body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.");
const loginPasswordCheck = body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.");
export const validateLogin = [loginUsernameCheck, loginPasswordCheck];
