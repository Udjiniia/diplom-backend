import {checkAuth, checkUser} from "../validations/checkAuth.js";
import {Router} from "express";
import {bookTicket, buyTicket, unbookTicket} from "../controllers/ticketController.js";

export const ticketRouter = new Router()


ticketRouter.patch("/book/:id", checkUser, bookTicket)
ticketRouter.patch("/unbook/:id", checkUser, unbookTicket)
ticketRouter.patch("/buy/:id", checkUser, buyTicket)