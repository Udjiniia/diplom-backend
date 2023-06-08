import mongoose from "mongoose";
import {checkTicketAvailabilityByShow, createTickets, replaceTickets} from "../services/ticketService.js";
import {
    createPerformanceWithTicketsAndSession,
    createReplacementPerformance,
    deletePerformance,
    getPerformance,
    getPerformances,
    getPerformancesByDate,
    getTimeForShowByDate,
} from "../services/performanceService.js"
import {createWorkSessionForPerformance} from "../services/workSessionService.js";
import {validationResult} from "express-validator";


export const createPerformance = async (req, res) => {
    const session = await mongoose.connection.startSession();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        await session.startTransaction();
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
    await session.endSession();
};

export const createNewReplacementPerformance = async (req, res) => {
    const session = await mongoose.connection.startSession();
    try {
        await session.startTransaction();
        const performance = await createReplacementPerformance(req.params.id, req.body.show, req.body.hall, req.body.performanceTime,
            req.body.details, req.userId, req.body.performanceAvatarUrl, req.body.prices)


        for (const s of req.body.sessions) {
            await createWorkSessionForPerformance(s[0], performance._id, s[2], s[1])
        }

        await deletePerformance(req.params.id)
        await session.commitTransaction();
        res.json(performance);
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        res.status(500).json({
                message: "Rescheduling of the performance and the tickets failed"
            }
        )
    }
    await session.endSession()
};

export const getPerformanceById = async (req, res) => {
    try {
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
        const performances = await getPerformances()
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
        const workers = []

        for (const s of req.body.sessions) {
            workers.push(s[0])
        }

        const schedule = await getTimeForShowByDate(new Date(req.body.date), req.body.show, req.body.interval, workers, req.body.hall)
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
        const available = await checkTicketAvailabilityByShow(req.params.id)
        res.json(available);
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get the performances "
            }
        )
    }
};

export const replacePerformance = async (req, res) => {
    const session = await mongoose.connection.startSession();
    try {
        await session.startTransaction();
        await replaceTickets(req.params.id, req.body.id)
        await deletePerformance(req.params.id)
        await session.commitTransaction();
        res.json()
    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        res.status(500).json({
                message: "Couldn`t replace the performances "
            }
        )
    }
    await session.endSession()
};

export const removePerformance = async (req, res) => {
    const session = await mongoose.connection.startSession();
    try {
        await session.startTransaction();
        await deletePerformance(req.params.id)
        await session.commitTransaction();
        res.json()
    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        res.status(403).json({
            message: 'Could not delete performance',
        });
    }
    await session.endSession()
};