import {body} from "express-validator";


export const registerValidator = [
    body("email", "Wrong email format").isEmail(),
    body("password", "Password should be min 5 characters").isLength({min: 5}),
    body("firstName", "First Name should be min 1 characters").isLength({min: 1}),
    body("birthday").isISO8601().toDate(),
    body("phone", "Wrong phone format").isLength({min: 10}).isMobilePhone("any"),
    body("lastName", "Last name should be min 3 characters").isLength({min: 3}),
    body("avatarUrl").optional(),
]

export const updatingProfileValidator = [
    body("email", "Wrong email format").isEmail(),
    body("firstName", "First Name should be min 1 characters").isLength({min: 1}),
    body("birthday").isISO8601().toDate(),
    body("phone", "Wrong phone format").isLength({min: 10}).isMobilePhone("any"),
    body("lastName", "Last name should be min 3 characters").isLength({min: 3}),
    body("avatarUrl").optional(),
]

export const loginValidator = [
    body("email", "Wrong email format").isEmail(),
    body("password", "Password should be min 5 characters").isLength({min: 5}),
]