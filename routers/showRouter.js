import {checkAdministration, checkAuth, checkUser} from "../validations/checkAuth.js";
import {Router} from "express";
import {showValidator} from "../validations/showValid.js";
import {createShow, getAllShows, getShowById, removeShow, updateShow} from "../controllers/showController.js";

export const showRouter = new Router()

showRouter.post("/create", checkAdministration, showValidator, createShow)
showRouter.get("/all", checkAdministration, getAllShows)
showRouter.get("/:id", checkAdministration, getShowById)
showRouter.put("/update/:id", checkAdministration, showValidator, updateShow)
showRouter.delete("/delete/:id", checkAdministration, removeShow)