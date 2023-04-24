import {body} from "express-validator";

export const showValidator = [
    body("name", "Name should be min 3 characters").isLength({min: 3}),
    body("author", "Authors name should be min 4 characters").isLength({ min: 4 }),
    body("duration").isISO8601().toDate(),
    body("description", "Description should be min 50 characters").isLength({ min: 50 }),
    body("details", "Details should be min 10 characters ").isLength({min: 10}).optional(),
    body("showAvatarUrl").optional(),
]