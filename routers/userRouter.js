import {register, profile, login, removeRrofile, updateProfile, updatePassword, getAllEmployees, updateStatus, getUserById} from "../controllers/userController.js"
import {loginValidator, registerValidator, updatingProfileValidator} from "../validations/authValid.js";
import {checkAdministration, checkAuth, checkUser} from "../validations/checkAuth.js";
import {Router} from "express";

export const userRouter = new Router()

userRouter.post("/register", registerValidator, register);
userRouter.post("/login", loginValidator, login);
userRouter.get("/me", checkAuth, profile);
userRouter.delete("/me/deleteAccount", checkUser, removeRrofile)
userRouter.put("/me/updateAccount", checkAuth, updatingProfileValidator, updateProfile)
userRouter.patch("/me/updatePassword", checkAuth, updatePassword)
userRouter.get("/:id", checkAdministration, getUserById)