import {check, validationResult} from "express-validator";
import {addToBasketTicketById, unbookTicketById, bookTicketById, buyTicketById} from "../services/ticketService.js"


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

export const unbookTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

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

