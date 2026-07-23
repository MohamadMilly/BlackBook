import { body } from "express-validator";
export const validateFirstName = body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("First name must only contain letters.");
export const validateLastName = body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Last name must only contain letters.");
export const validateUserName = body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters long.");
export const validatePassword = body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.");
export const validateConfirmPassword = body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
    }
    return true;
});
