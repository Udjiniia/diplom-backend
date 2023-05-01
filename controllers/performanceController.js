import {validationResult} from "express-validator";
import Performance from "../models/Performance.js";
import Show from "../models/Show.js";
import Hall from "../models/Hall.js";
import {createTickets} from "./ticketController.js";
import {getPerformancesByDate, getTimeForShowByDate} from "../services/performanceService.js"

export const createPerformance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const show = await Show.findOne({name: req.body.showName, author: req.body.showAuthor})
        const hall = await Hall.findOne({name: req.body.hallName})

        const endTime = new Date(req.body.performanceTime)
        endTime.setHours(show.duration.getHours() + endTime.getHours())
        endTime.setMinutes(show.duration.getMinutes() + endTime.getMinutes())
        const doc = new Performance({
            performanceTime: req.body.performanceTime,
            details: req.body.details,
            creator: req.userId,
            show: show,
            hall: hall,
            performanceAvatarUrl: req.body.performanceAvatarUrl,
            performanceEndTime: endTime
        })

        const performance = await doc.save();

        await createTickets(performance, hall, req.body.prices)

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

        const schedule = await getTimeForShowByDate(new Date(req.body.date),show)

        res.json(schedule);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get the slots for this date"
            }
        )
    }
};
