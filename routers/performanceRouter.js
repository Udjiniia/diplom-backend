import {checkAdministration, checkAuth, checkUser} from "../validations/checkAuth.js";
import {Router} from "express";
import {performanceValidator} from "../validations/performanceValid.js";
import {
    createPerformance,
    getCheckedForReplacementByShow,
    getReplacementSlots, getAllPerformances, getPerformanceById, removePerformance
} from "../controllers/performanceController.js";

export const performanceRouter = new Router()

performanceRouter.post("/create", checkAdministration, performanceValidator, createPerformance)
performanceRouter.post("/replace/:id", checkAdministration, getCheckedForReplacementByShow)
performanceRouter.post("/replaceSlots", checkAdministration, getReplacementSlots)
performanceRouter.get("/all", getAllPerformances)
performanceRouter.get("/:id",checkAuth, getPerformanceById)
performanceRouter.delete("/delete/:id",checkAdministration, removePerformance)