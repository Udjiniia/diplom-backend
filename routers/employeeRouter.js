
import {Router} from "express";
import {checkHead} from "../validations/checkAuth.js";
import {getAllEmployees, getUserById, updateStatus} from "../controllers/userController.js";

export const employeeRouter = new Router()

employeeRouter.get("/employee", checkHead, getAllEmployees)
employeeRouter.get("/employee/:id", checkHead, getUserById)
employeeRouter.patch("/employee/updateStatus/:id", checkHead, updateStatus)