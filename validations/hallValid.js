import {body} from "express-validator";


export const hallValidator = [
    body("name", "Name should be min 3 characters").isLength({min: 3}),
    body("capacity", "Capacity should be min 2 characters ").isFloat({ min: 2 }),
    body("rows", "Rows should be min 1 ").isFloat({ min: 1 }),
    body("details", "Details should be min 10 characters").isLength({min: 10}).optional(),
]