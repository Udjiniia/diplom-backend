import express from "express";
import mongoose from "mongoose"
import multer from "multer"
import * as path from "path";
import cors from "cors"

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {registerValidator, loginValidator} from "./validations/auth.js"
import {hallValidator} from "./validations/hallValid.js"
import {showValidator} from "./validations/showValid.js";
import {checkAdmin, checkHead, checkUser, checkAuth, checkAdministration} from "./validations/checkAuth.js"

import {register, profile, login, removeRrofile, updateProfile} from "./controllers/userController.js"
import {createHall, getAllHalls, getHallById, updateHall, removeHall} from "./controllers/hallController.js"
import {createShow, removeShow, updateShow, getShowById, getAllShows } from "./controllers/showController.js";

import User from "./models/User.js"
import Hall from "./models/Hall.js"
import Show from "./models/Show.js";

mongoose.connect(
    `mongodb+srv://admin:ihatekpi@cluster0.nu2roiy.mongodb.net/theater?retryWrites=true&w=majority`).then(
    () => {
        console.log("DB OK")
    }
).catch((err) => console.log("DB error", err))

const app = express();
app.use(cors());

process.env.TZ = "Europe/Kyiv";
console.log(new Date().toString());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage
})

app.use(express.static(path.join(__dirname, 'build')));


app.get(['/', '/register', '/login', '/profile', '/updateProfile'], (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post("/register", registerValidator, register);

app.post("/login", loginValidator, login);
app.get("/me", checkAuth, profile);
app.get("/checkAuth", checkAuth, (req, res) => res.json({
    success: true
}));

app.delete("/me/deleteAccount", checkUser, removeRrofile)
app.patch("/me/updateAccount", checkUser, registerValidator, updateProfile)
app.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

//hall
app.post("/hall/create", checkAdministration, hallValidator, createHall)
app.get("/hall/all", checkAdministration, getAllHalls)
app.get("/hall/:id", checkAdministration, getHallById)
app.patch("/hall/update/:id", checkAdministration, hallValidator, updateHall)
app.delete("/hall/delete/:id", checkAdministration, removeHall)

//show
app.post("/show/create", checkAdministration, showValidator, createShow)
app.get("/show/all", checkAdministration, getAllShows)
app.get("/show/:id", checkAdministration, getShowById)
app.patch("/show/update/:id", checkAdministration, showValidator, updateShow)
app.delete("/show/delete/:id", checkAdministration, removeShow)


app.listen(process.env.PORT || 5000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK")
});