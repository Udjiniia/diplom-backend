import {checkAdministration, checkHead} from "../validations/checkAuth.js";
import {
    getAllEmployees,
    getUserById,
    updateStatus,
    getAllWorkers,
    getAllActiveWorkers
} from "../controllers/userController.js";
import {Router} from "express";

export const employeeRouter = new Router()

employeeRouter.get("/employees", checkHead, getAllEmployees)
employeeRouter.get("/employee/:id", checkHead, getUserById)
employeeRouter.patch("/updateStatus/:id", checkHead, updateStatus)
employeeRouter.get("/workers", checkAdministration, getAllWorkers)
employeeRouter.get("/workers/active", checkAdministration, getAllActiveWorkers)
