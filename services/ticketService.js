import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Performance from "../models/Performance.js";
import Hall from "../models/Hall.js";
import Show from "../models/Show.js";
import ticket from "../models/Ticket.js";
import QRCode from "qrcode"
import nodemailer from "nodemailer"
import fs from "fs"

String.prototype.trimLenFrom = function (start, length) {
    return this.length > length ? this.substring(start, length) : this;
}
export const createTickets = async (performance, hallName, priceArray) => {
    const hall = await Hall.findOne({name: hallName})
    console.log()
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


    const tickets = await Ticket.updateMany({
            owner: userId,
            status: "booked"
        },
        {
            $set: {status: "free"}
        }, {
            multi: true
        })


    return tickets;
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
        sendTicketToEmail(ticketOwner.email, ticketId, ticketData)
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

    console.log(ticketData.time.getDate())
    console.log(ticketData.time.getMonth())

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

export const replaceTickets = async (performanceCancelledId, performanceId) => {
    const ticketsCancelled = await Ticket.find({performance: performanceCancelledId, status: "sold"})
    const ticketsFree = await Ticket.find({performance: performanceId, status: {$in: ["free", "booked", "in basket"]}})

    const replaced = []
    for (const tC of ticketsCancelled) {
        for (const tF of ticketsFree) {
            if (tC.row === tF.row && tC.seat === tF.seat) {
                await tF.updateOne(
                    {
                        owner: tC.owner,
                        status: "sold",
                        qrUrl: await tC.qrUrl
                    })
                replaced.push(tF)
            }
        }
    }

    return (replaced)
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
    const newPerformance = await Performance.findById(newPerformanceId)
    const show = await Show.findById(newPerformance.show)

    const mailOptions = {
        from: "TheaterPoshta@gmail.com",
        to: `${email}`,
        subject: `Переніс вистави "${show.name}"`,
        text: `Ваш квиток на виставу "${show.name}", що повинна була відбутись відбудеться ${performance.performanceTime.getDay()}/${performance.performanceTime.getMonth()}/${performance.performanceTime.getFullYear()} o ${performance.performanceTime.getHours()}:${performance.performanceTime.getMinutes()} ПЕРЕНОСИТЬСЯ на ${newPerformance.performanceTime.getDay()}/${newPerformance.performanceTime.getMonth()}/${newPerformance.performanceTime.getFullYear()} o ${newPerformance.performanceTime.getHours()}:${newPerformance.performanceTime.getMinutes()}. Попередні квитки дійсні!`,
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

    const tickets = await ticket.find({performance: performanceId, status: {$in: ['free', 'in basket']}}).sort({row: 1, seat: 1})
    return tickets;
}

export const getTicketsForUserBasket = async (userId) => {

    const tickets = await ticket.find({owner: userId, status:  'in basket'}).sort({row: 1, seat: 1})
    return tickets;
}

export const getTicketsForUser = async (userId) => {

    const tickets = await ticket.find({owner: userId, status:'sold'}).sort({row: 1, seat: 1})
    return tickets;
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

    const tickets = await ticket.find({performance: performanceId}).sort({row: 1, seat: 1})
    return tickets;
}



