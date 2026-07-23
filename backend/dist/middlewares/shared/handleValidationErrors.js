import { validationResult } from "express-validator";
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req).formatWith((error) => {
        return {
            field: error.type === "field" ? error.path : "unknown",
            message: error.msg,
        };
    });
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
