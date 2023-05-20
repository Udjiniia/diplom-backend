import {Router} from "express";
import {checkAdministration, checkAuth, checkWorker} from "../validations/checkAuth.js";
import {checkWorkerAvailability, getScheduleForWorker} from "../controllers/workSessionController.js";
import {getSlotsByDateByShow, getScheduleByDate} from "../controllers/performanceController.js";

export const scheduleRouter = new Router()

scheduleRouter.post("/schedule", checkAuth, getScheduleByDate)
scheduleRouter.post("/slots", checkAdministration, getSlotsByDateByShow)
scheduleRouter.post("/mySchedule", checkWorker, getScheduleForWorker)
scheduleRouter.post("/workerAvailable", checkAdministration, checkWorkerAvailability)