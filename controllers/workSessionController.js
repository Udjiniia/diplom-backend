import {validationResult} from "express-validator";
import {getWorkerScheduleByDate, getWorkerStatusByTime} from "../services/workSessionService.js";


export const getScheduleForWorker = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const schedule = await getWorkerScheduleByDate(new Date(req.body.date), req.userId)

        res.json(schedule)

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "This schedule doesn`t exist"
            }
        )
    }
};

export const checkWorkerAvailability = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const status = await getWorkerStatusByTime(new Date(req.body.startTime),new Date(req.body.endTime), req.body.workerId)

        res.json(status)

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "This schedule doesn`t exist"
            }
        )
    }
};
