import {Router} from "express";
import {checkAdministration, checkAuth, checkWorker} from "../validations/checkAuth.js";
import {checkWorkerAvailability, getScheduleForWorker, getPerformanceSessions} from "../controllers/workSessionController.js";
import {getSlotsByDateByShow, getScheduleByDate, removePerformance} from "../controllers/performanceController.js";


export const scheduleRouter = new Router()

scheduleRouter.post("/schedule", checkAuth, getScheduleByDate)
scheduleRouter.post("/slots", checkAdministration, getSlotsByDateByShow)
scheduleRouter.post("/my-schedule", checkWorker, getScheduleForWorker)
scheduleRouter.post("/workerAvailable", checkAdministration, checkWorkerAvailability)
scheduleRouter.get("/sessions/:id",checkAdministration, getPerformanceSessions)