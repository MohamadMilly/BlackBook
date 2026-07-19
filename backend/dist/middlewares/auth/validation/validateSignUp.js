import { prisma } from "../../../lib/prisma.js";
import { validateConfirmPassword, validateFirstName, validateLastName, validatePassword, validateUserName, } from "./fieldsValidations.js";
export const validateSignUp = [
    validateFirstName,
    validateLastName,
    validateUserName.custom(async (value, { req }) => {
        const user = await prisma.user.findUnique({
            where: {
                username: value,
            },
        });
        if (user) {
            throw new Error("username is already used.");
        }
        return true;
    }),
    validatePassword,
    validateConfirmPassword,
];
