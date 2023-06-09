import express from "express";
import mongoose from "mongoose"
import multer from "multer"
import * as path from "path";
import cors from "cors"

import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
    checkHead,
    checkAuth,
    checkAdministration,
    checkWorker,
    checkRole
} from "./validations/checkAuth.js"

import {userRouter} from "./routers/userRouter.js";
import {ticketRouter} from "./routers/ticketsRouter.js";
import {showRouter} from "./routers/showRouter.js";
import {performanceRouter} from "./routers/performanceRouter.js";
import {hallRouter} from "./routers/hallRouter.js";
import {employeeRouter} from "./routers/employeeRouter.js";
import {scheduleRouter} from "./routers/scheduleRouter.js";

mongoose.connect(
    `mongodb+srv://Udj:password1616@diplom.zlsmfxt.mongodb.net/theater`).then(
    () => {
        console.log("DB OK")
    }
).catch((err) => console.log("DB error", err))

const app = express();
app.use(cors());

process.env.TZ = "Europe/Greenwich";
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

app.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.use(express.static(path.join(__dirname, 'build')));


app.get(['/', '/register', '/login', '/profile', '/update-profile', '/shows', '/halls', '/update-password',
    '/hall-create', '/employees', '/employee-create', '/show-create', '/performances', '/performance-create',
    '/all-tickets/:id', '/my-schedule', '/schedule', '/schedule-tickets', '/tickets/:id', '/basket',
    '/tickets', '/posters', 'workers/:id', 'employee-schedule/:id', 'performance-reschedule/:id'], (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/qrcodes', express.static('qrcodes'));

app.get("/checkAuth", checkAuth, (req, res) => res.json({
    success: true
}));
app.get("/checkWorker", checkWorker, (req, res) => res.json({
    success: true
}))
app.get("/checkHead", checkHead, (req, res) => res.json({
    success: true
}))
app.get("/checkRole", checkRole)
app.get("/checkAdministration", checkAdministration, (req, res) => res.json({
    success: true
}))

//users
app.use("/user", userRouter)
//hall
app.use("/hall", hallRouter)
//show
app.use("/show", showRouter)
//performance + tickets
app.use("/ticket", ticketRouter)
app.use("/performance", performanceRouter)
//schedule
app.use("/schedule", scheduleRouter)
//employees
app.use("/employee", employeeRouter)

app.listen(process.env.PORT || 5000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK")
});