import { body } from "express-validator";

export const createTaskValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is Required!"),
  body("status")
    .notEmpty()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Invalid status value"),
];

export const updateTaskValidation = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Invalid status value"),
];
