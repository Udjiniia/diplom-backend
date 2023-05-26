import {check, validationResult} from "express-validator";
import {addToBasketTicketById,getAllTicketsForPerformance, unbookTicketById, bookTicketById, buyTicketById,unbookTicketForUser, getTicketsFree, getTicketsForUserBasket, getTicketsForUser, removeFromBasketTicketById} from "../services/ticketService.js"


export const bookTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const ticket = await bookTicketById(req.params.id, req.userId)
        res.json(ticket)

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};

export const buyTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const ticket = await buyTicketById(req.params.id, req.userId)
        res.json(ticket)

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};


export const basketTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const ticket = await addToBasketTicketById(req.params.id, req.userId)
        res.json(ticket)

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};

export const unBasketTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const ticket = await removeFromBasketTicketById(req.params.id)
        res.json(ticket)

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};
export const unbookTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        console.log(req.params.id)

        const ticket = await unbookTicketById(req.params.id)
        res.json(ticket);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};

export const unbookTicketByUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const tickets = await unbookTicketForUser(req.userId)
        res.json(tickets);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};

export const getFreeTickets = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const tickets= await getTicketsFree( req.params.performance)
        res.json(tickets);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};

export const getBasketTickets = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const tickets = await getTicketsForUserBasket(req.userId)
        res.json(tickets);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};

export const getUserTickets = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const tickets= await getTicketsForUser( req.userId)
        res.json(tickets);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};

export const getPerformanceTickets = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const tickets = await getAllTicketsForPerformance(req.params.id)
        res.json(tickets)

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};
