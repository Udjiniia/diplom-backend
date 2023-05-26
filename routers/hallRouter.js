import {checkAdministration, checkHead} from "../validations/checkAuth.js";
import {hallValidator} from "../validations/hallValid.js";
import {createHall, getAllHalls, getHallById, removeHall, updateHall, getHallByName} from "../controllers/hallController.js";
import {Router} from "express";

export const hallRouter = new Router()

hallRouter .post("/create", checkHead, hallValidator, createHall)
hallRouter .get("/all", checkAdministration, getAllHalls)
hallRouter .get("/:id", getHallById)
hallRouter .post("/name", checkAdministration, getHallByName)
hallRouter .put("/update/:id", checkHead, hallValidator, updateHall)
hallRouter .delete("/delete/:id", checkHead, removeHall)

