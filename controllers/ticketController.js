import Performance from "../models/Performance.js";
import Ticket from "../models/Ticket.js";
import {validationResult} from "express-validator";
import Show from "../models/Show.js";
import Hall from "../models/Hall.js";

export const createTickets = async (performance, hall, priceArray) => {
    const allSeats = hall.capacity
    const rows = hall.rows
    const lastRow = allSeats % rows
    const seats = ( allSeats - lastRow )/ (rows)

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j <= seats; j++) {
            await createTicket(i, j, performance, priceArray[i-1])
        }
    }

    for (let i = 1; i <= lastRow + seats; i++) {
        await createTicket(rows, i, performance, priceArray[rows-1] )
    }

}

const createTicket = async (row, seat, performance, price) => {

    const doc = new Ticket({
        row: row,
        seat: seat,
        price: price,
        performance: performance
    })

    const ticket = await doc.save();
}

export const bookTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await Ticket.findOneAndUpdate({
                _id: req.params.id,
            },
            {
                status: "booked",
                owner: req.userId
            })

        const ticket = await Ticket.findById(req.params.id)

        res.json(ticket);

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

        await Ticket.findOneAndUpdate({
                _id: req.params.id,
            },
            {
                status: "free",
                owner: {$unset: {category: 1 }}
            })

        const ticket = await Ticket.findById(req.params.id)

        res.json(ticket);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "No such ticket"
            }
        )
    }
};