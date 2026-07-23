import { body } from "express-validator";

export const validateCreatePost = [
  body("title")
    .optional({ nullable: true }) // Allowing null or undefined
    .isString()
    .withMessage("Title must be a text string")
    .trim(),
  
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is mandatory and cannot be empty")
    .isString()
    .withMessage("Content must be a text string"),

  body("images")
    .isArray()
    .withMessage("Images must be an array")
    .custom((value: any[]) => {
      for (const url of value) {
        if (typeof url !== "string" || !url.startsWith("http")) {
          throw new Error("Each image must be a valid URL string");
        }
      }
      return true;
    }),
];
