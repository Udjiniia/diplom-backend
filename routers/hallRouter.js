import {checkAdministration, checkHead} from "../validations/checkAuth.js";
import {hallValidator} from "../validations/hallValid.js";
import {createHall, getAllHalls, getHallById, removeHall, updateHall} from "../controllers/hallController.js";
import {Router} from "express";

export const hallRouter = new Router()

hallRouter .post("/create", checkHead, hallValidator, createHall)
hallRouter .get("/all", checkAdministration, getAllHalls)
hallRouter .get("/:id", checkAdministration, getHallById)
hallRouter .put("/update/:id", checkHead, hallValidator, updateHall)
hallRouter .delete("/delete/:id", checkHead, removeHall)
