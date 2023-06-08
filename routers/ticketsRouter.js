import {checkAdministration, checkUser} from "../validations/checkAuth.js";
import {
    bookTicket,
    buyTicket,
    unbookTicket,
    unbookTicketByUser,
    getFreeTickets,
    getPerformanceTickets,
    unBasketTicket,
    basketTicket,
    getBasketTickets,
    getUserTickets
} from "../controllers/ticketController.js";
import {Router} from "express";


export const ticketRouter = new Router()


ticketRouter.patch("/book/:id", checkUser, bookTicket)
ticketRouter.patch("/basket/:id", checkUser, basketTicket)
ticketRouter.patch("/unbasket/:id", checkUser, unBasketTicket)
ticketRouter.patch("/unbook/:id", checkUser, unbookTicket)
ticketRouter.patch("/buy/:id", checkUser, buyTicket)
ticketRouter.patch("/unbook", checkUser, unbookTicketByUser)
ticketRouter.get("/free/:performance", checkUser, getFreeTickets)
ticketRouter.get("/basket", checkUser, getBasketTickets)
ticketRouter.get("/bought", checkUser, getUserTickets)
ticketRouter.get("/tickets/:id", checkAdministration, getPerformanceTickets)