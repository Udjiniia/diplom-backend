import Ticket from "../models/Ticket.js";
import ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Performance from "../models/Performance.js";
import Hall from "../models/Hall.js";
import Show from "../models/Show.js";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import * as fs from "fs";
import mongoose from "mongoose";



String.prototype.trimLenFrom = function (start, length) {
    return this.length > length ? this.substring(start, length) : this;
}
export const createTickets = async (performance, hallId, priceArray) => {

    const hall = await Hall.findOne({_id: hallId})
    const allSeats = hall.capacity
    const rows = hall.rows
    const lastRow = allSeats % rows
    const seats = (allSeats - lastRow) / (rows)

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j <= seats; j++) {
            await createTicket(i, j, performance, priceArray[i - 1])
        }
    }

    for (let i = 1; i <= lastRow + seats; i++) {
        await createTicket(rows, i, performance, priceArray[rows - 1])
    }

}

const createTicket = async (row, seat, performance, price) => {

    const doc = new Ticket({
        row: row,
        seat: seat,
        price: price,
        performance: performance
    })

    const ticket = await doc.save();
}

export const bookTicketById = async (ticketId, userId) => {

    await Ticket.findOneAndUpdate({
            _id: ticketId,
        },
        {
            status: "booked",
            owner: userId
        })

    return Ticket.findById(ticketId);
}

export const unbookTicketById = async (ticketId) => {

    await Ticket.findOneAndUpdate({
            _id: ticketId,
        },
        {
            status: "free",
            owner: null
        })


    return Ticket.findById(ticketId);
}

export const unbookTicketForUser = async (userId) => {
    return Ticket.updateMany({
            owner: userId,
            status: "booked"
        },
        {
            $set: {status: "free"}
        }, {
            multi: true
        });
}

export const buyTicketById = async (ticketId, userId) => {

    await Ticket.findOneAndUpdate({
            _id: ticketId,
        },
        {
            status: "sold",
            owner: userId
        })
    const ticket = await Ticket.findById(ticketId)
    const ticketPerformance = await Performance.findById(ticket.performance)
    const ticketHall = await Hall.findById(ticketPerformance.hall)
    const ticketShow = await Show.findById(ticketPerformance.show)
    const ticketOwner = await User.findById(ticket.owner)

    const ticketData = {
        show: ticketShow.name,
        time: ticketPerformance.performanceTime,
        hall: ticketHall.name,
        row: ticket.row,
        seat: ticket.seat,
        firstname: ticketOwner.firstName,
        lastname: ticketOwner.lastName,
        price: ticket.price
    }

    const stringTicket = JSON.stringify(ticketData)

    QRCode.toFile(`./qrcodes/${ticketId}.png`, stringTicket, {
        color: {
            dark: '#000',  // Blue dots
            light: '#0000' // Transparent background
        }
    }, async function (err) {
        if (err) throw err
        await ticket.updateOne({qrUrl: `/qrcodes/${ticketId}.png`})
        console.log(`/qrcodes/${ticketId}.png`)
        await sendTicketToEmail(ticketOwner.email, ticketId, ticketData)
    })

    return ticket;
}

export const addToBasketTicketById = async (ticketId, userId) => {

    await Ticket.findOneAndUpdate({
            _id: ticketId,
        },
        {
            status: "in basket",
            owner: userId
        })

    return Ticket.findById(ticketId);
}

const sendTicketToEmail = (email, ticketId, ticketData) => {

    const smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'TheaterPoshta@gmail.com',
            pass: 'fwmfvblczpnujvqh'
        }
    };
    const transporter = nodemailer.createTransport(smtpConfig);


    const mailOptions = {
        from: "TheaterPoshta@gmail.com",
        to: `${email}`,
        subject: `Квиток на виставу "${ticketData.show}"`,
        text: `Ваш квиток на виставу "${ticketData.show}", що відбудеться ${ticketData.time.getDate()}-${ticketData.time.getMonth() + 1}-${ticketData.time.getFullYear()}. Зала ${ticketData.hall}, ряд ${ticketData.row}, місце ${ticketData.seat}. Чекаємо на Вас!`,
        attachments: [{
            filename: `${ticketData.firstname}  ${ticketData.lastname} квиток.png`,
            content: fs.createReadStream(`./qrcodes/${ticketId}.png`)
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

export const checkTicketAvailability = async (performanceCancelledId, performanceId) => {
    const ticketsCancelled = await Ticket.find({performance: performanceCancelledId, status: "sold"})
    const ticketsFree = await Ticket.find({performance: performanceId, status: {$in: ["free", "booked", "in basket"]}})
    const replaced = []

    for (const tC of ticketsCancelled) {
        for (const tF of ticketsFree) {
            if (tC.row === tF.row && tC.seat === tF.seat) {
                replaced.push(tF)
            }
        }
    }

    return (replaced.length === ticketsCancelled.length)
}

export const checkTicketAvailabilityByShow = async (performanceId) => {
    const performance = await Performance.findOne({_id: performanceId})
    const show = await Show.findOne({_id: performance.show})
    const performances = await Performance.find({
        show: show,
        performanceTime: {$gt: performance.performanceTime}
    }).populate("show").populate("hall")
    const available = []

    for (const p of performances) {
        if (await checkTicketAvailability(performanceId, p._id)) {
            available.push(p)
        }
    }

    return available
}

export const replaceTickets = async (performanceCancelledId, performanceId) => {
    const session = await mongoose.connection.startSession();
    try {
        await session.startTransaction();
        const ticketsCancelled = await Ticket.find({performance: performanceCancelledId, status: "sold"})
        const ticketsFree = await Ticket.find({
            performance: performanceId,
            status: {$in: ["free", "booked", "in basket"]}
        })

        for (const tC of ticketsCancelled) {
            for (const tF of ticketsFree) {
                if (tC.row === tF.row && tC.seat === tF.seat) {
                    await Ticket.findOneAndUpdate({
                            _id: tF._id,
                        },
                        {
                            owner: tC.owner,
                            status: "sold",
                            qrUrl: tC.qrUrl
                        })
                }
            }
        }

        const replaced =  await Ticket.find({performance: performanceId, status: "sold"}).populate("owner")

        for (const r of replaced) {
            await sendReplacementEmail(r.owner.email, performanceCancelledId, performanceId)
        }
        await session.commitTransaction();
        return replaced
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
    }
    await session.endSession()
}

export const sendReplacementEmail = async (email, performanceId, newPerformanceId) => {
    const smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'TheaterPoshta@gmail.com',
            pass: 'fwmfvblczpnujvqh'
        }
    };
    const transporter = nodemailer.createTransport(smtpConfig);

    const performance = await Performance.findById(performanceId)
    const newPerformance = await Performance.findById(newPerformanceId).populate("show")

    const mailOptions = {
        from: "TheaterPoshta@gmail.com",
        to: `${email}`,
        subject: `Переніс вистави "${newPerformance.show.name}"`,
        text: `Ваш квиток на виставу "${newPerformance.show.name}", що повинна була відбутись відбудеться ${performance.performanceTime.getDate()}-${performance.performanceTime.getMonth() + 1}-${performance.performanceTime.getFullYear()} o ${performance.performanceTime.getHours()}:${performance.performanceTime.getMinutes()} 
        ПЕРЕНОСИТЬСЯ на ${newPerformance.performanceTime.getDate()}-${newPerformance.performanceTime.getMonth() + 1}-${newPerformance.performanceTime.getFullYear()} o ${newPerformance.performanceTime.getHours()}:${newPerformance.performanceTime.getMinutes()}. Попередні квитки дійсні!`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

export const getTicketsFree = async (performanceId) => {

    return ticket.find({performance: performanceId, status: {$in: ['free', 'in basket']}}).sort({
        row: 1,
        seat: 1
    }).populate("performance").populate({path: "performance", populate: {path: "show"}})
        .populate({path: "performance", populate: {path: "hall"}})
}

export const getTicketsForUserBasket = async (userId) => {

    return ticket.find({owner: userId, status: 'in basket'}).sort({row: 1, seat: 1}).populate("performance").populate({path: "performance", populate: {path: "show"}})
        .populate({path: "performance", populate: {path: "hall"}})
}

export const getTicketsForUser = async (userId) => {

    return ticket.find({owner: userId, status: 'sold'}).sort({
        row: 1,
        seat: 1
    }).populate("performance").populate({path: "performance", populate: {path: "show"}})
        .populate({path: "performance", populate: {path: "hall"}})

}

export const removeFromBasketTicketById = async (ticketId) => {
    await Ticket.findOneAndUpdate({
            _id: ticketId,
        },
        {
            status: "free",
            owner: null
        })

    return Ticket.findById(ticketId);
}

export const getAllTicketsForPerformance = async (performanceId) => {
    return ticket.find({performance: performanceId}).sort({row: 1, seat: 1}).populate("owner")
        .populate("performance");
}

export const getSoldTicketsForPerformance = async (performanceId) => {
    return ticket.find({performance: performanceId, status: "sold"}).sort({row: 1, seat: 1}).populate("owner")
        .populate("performance");
}



