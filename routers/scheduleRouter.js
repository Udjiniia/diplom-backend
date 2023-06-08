import {checkAdministration, checkAuth, checkHead, checkWorker} from "../validations/checkAuth.js";
import {
    checkWorkerAvailability,
    getScheduleForWorker,
    getPerformanceSessions,
    getScheduleForEmployee
} from "../controllers/workSessionController.js";
import {getSlotsByDateByShow, getScheduleByDate} from "../controllers/performanceController.js";
import {Router} from "express";


export const scheduleRouter = new Router()

scheduleRouter.post("/schedule", checkAuth, getScheduleByDate)
scheduleRouter.post("/slots", checkAdministration, getSlotsByDateByShow)
scheduleRouter.post("/my", checkWorker, getScheduleForWorker)
scheduleRouter.post("/employee/:id", checkHead, getScheduleForEmployee)
scheduleRouter.post("/workerAvailable", checkAdministration, checkWorkerAvailability)
scheduleRouter.get("/sessions/:id", checkAdministration, getPerformanceSessions)