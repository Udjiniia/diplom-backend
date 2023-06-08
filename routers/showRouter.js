import {checkAdministration} from "../validations/checkAuth.js";
import {showValidator} from "../validations/showValid.js";
import {createShow, getAllShows, getShowById, removeShow, updateShow} from "../controllers/showController.js";
import {Router} from "express";

export const showRouter = new Router()

showRouter.post("/create", checkAdministration, showValidator, createShow)
showRouter.get("/all", getAllShows)
showRouter.get("/:id", getShowById)
showRouter.put("/update/:id", checkAdministration, showValidator, updateShow)
showRouter.delete("/delete/:id", checkAdministration, removeShow)
