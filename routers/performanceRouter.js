import {checkAdministration, checkAuth} from "../validations/checkAuth.js";
import {performanceValidator} from "../validations/performanceValid.js";
import {
    createPerformance,
    getCheckedForReplacementByShow,
    getAllPerformances,
    getPerformanceById,
    removePerformance,
    createNewReplacementPerformance,
    replacePerformance
} from "../controllers/performanceController.js";
import {Router} from "express";

export const performanceRouter = new Router()

performanceRouter.post("/create", checkAdministration, performanceValidator, createPerformance)
performanceRouter.post("/reschedule/:id", checkAdministration, performanceValidator, createNewReplacementPerformance)
performanceRouter.get("/replace/:id", checkAdministration, getCheckedForReplacementByShow)
performanceRouter.post("/replace-performance/:id", checkAdministration, replacePerformance)
performanceRouter.get("/all", getAllPerformances)
performanceRouter.get("/:id", checkAuth, getPerformanceById)
performanceRouter.delete("/delete/:id", checkAdministration, removePerformance)