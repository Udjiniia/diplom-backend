import {
    getWorkerScheduleByDate,
    getWorkerStatusByTime,
    getWorkerSessionsByPerformace
} from "../services/workSessionService.js";


export const getScheduleForWorker = async (req, res) => {
    try {
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

export const getScheduleForEmployee = async (req, res) => {
    try {
        const schedule = await getWorkerScheduleByDate(new Date(req.body.date), req.params.id)
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
        const status = await getWorkerStatusByTime(new Date(req.body.startTime), new Date(req.body.endTime), req.body.workerId)
        res.json(status)
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "This schedule doesn`t exist"
            }
        )
    }
};


export const getPerformanceSessions = async (req, res) => {
    try {
        const schedule = await getWorkerSessionsByPerformace(req.params.id)
        res.json(schedule)
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "This schedule doesn`t exist"
            }
        )
    }
};