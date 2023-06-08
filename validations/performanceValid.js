import {body} from "express-validator";


export const performanceValidator = [
    body("performanceTime").isISO8601().toDate(),
    body("details", "Details should be min 10 characters ").isLength({min: 10}).optional(),
    body("performanceAvatarUrl").optional(),

]