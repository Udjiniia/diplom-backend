import {validationResult} from "express-validator";
import mongoose from "mongoose";
const conn = mongoose.connection;
import {createTickets, checkTicketAvailability} from "../services/ticketService.js";
import {getPerformancesByDate, getTimeForShowByDate, createPerformanceWithTicketsAndSession, findPerformanceSlot, getPerformance, getPerformances} from "../services/performanceService.js"
import {createWorkSessionForPerformance} from "../services/workSessionService.js";

export const createPerformance = async (req, res) => {
    const session = await conn.startSession();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        session.startTransaction();
        const performance = await createPerformanceWithTicketsAndSession(req.body.show, req.body.hall, req.body.performanceTime,
            req.body.details, req.userId, req.body.performanceAvatarUrl)

        await createTickets(performance, req.body.hall, req.body.prices)

        for (const s of req.body.sessions) {
            await createWorkSessionForPerformance(s[0], performance._id, s[2], s[1])
        }
        await session.commitTransaction();
        res.json(performance);

    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        res.status(500).json({
                message: "Creation of the performance and the tickets failed, try another data"
            }
        )
    }
};

export const getPerformanceById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const performance = await getPerformance(req.params.id)

        if (!performance) {
            return res.status(404).json({
                message: "No such performance"
            })
        }

        res.json(performance);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "This performance doesn`t exist"
            }
        )
    }
};

export const getAllPerformances = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const performances = await getPerformances()

        if (performances.length === 0) {
            return res.status(404).json({
                message: "Performances list is empty"
            })
        }
        res.json(performances);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get list of performances"
            }
        )
    }
};


export const getScheduleByDate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const schedule = await getPerformancesByDate(new Date(req.body.date))

        res.json(schedule);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get the schedule for this date"
            }
        )
    }
};

export const getSlotsByDateByShow = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const workers = []
        console.log(req.body.sessions)

        for (const s of req.body.sessions) {
            workers.push(s[0])
        }

        const schedule = await getTimeForShowByDate(new Date(req.body.date), req.body.show, req.body.interval, workers)

        res.json(schedule);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get the slots for this date"
            }
        )
    }
};

export const getCheckedForReplacementByShow = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const available = await checkTicketAvailability(req.params.id, req.body.performance)

        res.json(available);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get the performances "
            }
        )
    }
};

export const getReplacementSlots = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const schedule = await findPerformanceSlot(req.body.performanceId, new Date(req.body.date))

        res.json(schedule);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get the slots "
            }
        )
    }
};
