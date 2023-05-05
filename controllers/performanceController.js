import {check, validationResult} from "express-validator";
import Performance from "../models/Performance.js";
import Show from "../models/Show.js";
import Hall from "../models/Hall.js";
import {createTickets, checkTicketAvailability} from "../services/ticketService.js";
import {getPerformancesByDate, getTimeForShowByDate, createPerformanceWithTicketsAndSession, findPerformanceSlot} from "../services/performanceService.js"
import {createWorkSessionForPerformance} from "../services/workSessionService.js";
import show from "../models/Show.js";

export const createPerformance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const show = await Show.findOne({name: req.body.showName, author: req.body.showAuthor})
        const hall = await Hall.findOne({name: req.body.hallName})

        const performance = await createPerformanceWithTicketsAndSession(show, hall, req.body.performanceTime,
            req.body.details, req.userId, req.body.performanceAvatarUrl)

        await createTickets(performance, hall, req.body.prices)

        for (const s of req.body.session) {
            await createWorkSessionForPerformance(s[0], performance._id, s[1], s[2])
        }

        res.json(performance);

    } catch (err) {
        console.log(err);
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

        const performance = await Performance.findOne({_id: req.params.id})

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

        const performances = await Performance.find()

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

export const updatePerformance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await Performance.findOneAndUpdate({
                _id: req.params.id,
            },
            {
                performanceTime: req.body.performanceTime,
                details: req.body.details,
                creator: req.userId,
                show: show,
                hall: hall,
                performanceAvatarUrl: req.body.performanceAvatarUrl,
            })

        const show = await Show.findById(req.params.id)

        res.json(show);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Updating data failed"
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

        const show = await Show.findById(req.body.showId)

        const schedule = await getTimeForShowByDate(new Date(req.body.date), show, req.body.interval)

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

        const performance = await Performance.findById(req.params.id)
        const performance2 = await Performance.findById(req.body.performance)

        const available = await checkTicketAvailability(performance._id, performance2._id)

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
