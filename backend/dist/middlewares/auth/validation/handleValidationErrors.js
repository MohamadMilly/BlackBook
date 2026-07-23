import { validationResult } from "express-validator";
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req).formatWith((error) => {
        return {
            message: error.msg,
            field: error.type === "field" ? error.path : "unknown",
        };
    });
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
