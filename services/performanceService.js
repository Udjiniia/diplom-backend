import Hall from "../models/Hall.js";
import hall from "../models/Hall.js";
import Performance from "../models/Performance.js";
import workSession from "../models/WorkSession.js";
import {getWorkerStatusByTime} from "./workSessionService.js"
import Show from "../models/Show.js";
import Ticket from "../models/Ticket.js";
import {createTickets, replaceTickets, sendReplacementEmail, getSoldTicketsForPerformance} from "./ticketService.js";

export const createPerformanceWithTicketsAndSession = async (showId, hallId, time, details, userId, performanceAvatarUrl) => {
    const show = await Show.findOne({_id: showId})
    const hall = await Hall.findOne({_id: hallId})

    const endTime = new Date(time)
    endTime.setHours(show.duration.getHours() + endTime.getHours())
    endTime.setMinutes(show.duration.getMinutes() + endTime.getMinutes())

    const workTime = new Date(time)
    workTime.setHours(workTime.getHours() - 1)

    const workEndTime = new Date(endTime)
    workEndTime.setHours(workEndTime.getHours() + 1)

    const doc = new Performance({
        performanceTime: time,
        performanceWorkTime: workTime,
        details: details,
        creator: userId,
        show: show,
        hall: hall,
        performanceAvatarUrl: performanceAvatarUrl,
        performanceEndTime: endTime,
        performanceWorkEndTime: workEndTime
    })

    return await doc.save()

}
export const getPerformancesByDate = async (date) => {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)

    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    const halls = await Hall.find()
    const performances = await Performance.find({performanceTime: {$gte: date, $lte: nextDay}})
    let schedule = {};

    for (let h of halls) {
        let hallPerformances = []
        for (let p of performances) {
            if (p.hall._id.equals(h._id)) {
                hallPerformances.push(p)
            }
        }
        schedule[h.name] = hallPerformances
    }

    return schedule
}

export const getTimeForShowByDate = async (date, showId, interval, workers, hall) => {

    const show = await Show.findById(showId)

    date.setHours(14)
    date.setMinutes(0)
    date.setSeconds(0)

    interval = new Date(`2000-01-01T00:${interval}:00.000Z`)

    let nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(0)

    let halls = []
    if (hall) {
        halls.push(hall)
    } else {
        halls = await Hall.find({status: "active"})
    }

    const performances = await Performance.find({performanceTime: {$gte: date, $lte: nextDay}})

    let schedule = [];

    nextDay.setHours(nextDay.getHours() - show.duration.getHours() - 1)
    nextDay.setMinutes(nextDay.getMinutes() - show.duration.getMinutes())


    for (let h of halls) {
        let slots = []
        let busySlotsTimes = [new Date(date)]
        for (let p of performances) {
            if (p.hall._id.equals(h._id)) {
                busySlotsTimes.push(new Date((await p).performanceWorkTime)
                    , new Date(((await p).performanceWorkEndTime)))
                if (busySlotsTimes[busySlotsTimes.length - 1] >= nextDay) {
                    busySlotsTimes.pop()
                }
            }
        }
        if (busySlotsTimes.length % 2 !== 0) {
            busySlotsTimes.push(new Date(nextDay))
        }

        let freeSlots = []

        for (let i = 0; i < busySlotsTimes.length - 1; i += 2) {
            freeSlots.push([busySlotsTimes[i], busySlotsTimes[i + 1]])
        }

        for (let i = 0; i < freeSlots.length; i++) {
            let startDate = new Date(freeSlots[i][0])
            let dateEnd = new Date(freeSlots[i][0])
            dateEnd.setHours(dateEnd.getHours() + show.duration.getHours())
            dateEnd.setMinutes(dateEnd.getMinutes() + show.duration.getMinutes())
            while (dateEnd <= freeSlots[i][1] && dateEnd <= nextDay) {

                const available = []
                for (const w of workers) {
                    available.push(await getWorkerStatusByTime(startDate, dateEnd, w))
                }
                if (dateEnd <= freeSlots[i][1] && dateEnd <= nextDay && !available.includes(false) ) {
                    slots.push([new Date(startDate), new Date(dateEnd)])
                }
                startDate.setMinutes(startDate.getMinutes() + interval.getMinutes())
                dateEnd.setMinutes(dateEnd.getMinutes() + interval.getMinutes())
            }

        }
        schedule.push([h, slots])
    }


    return schedule
}

/*export const findPerformanceSlot = async (performanceId, date) => {
    console.log(performanceId)
    const performance = await Performance.findById(performanceId)
    date.setHours(0)
    date.setMinutes(0)
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    const startTime = new Date(date)


    const durationH = performance.performanceWorkEndTime.getHours() - performance.performanceWorkTime.getHours()
    const durationM = performance.performanceWorkEndTime.getMinutes() - performance.performanceWorkTime.getMinutes()
    const workSessions = await WorkSession.find({performance: performanceId})
    const workers = []

    const endTime = new Date(startTime)


    for (const s of workSessions) {
        workers.push(s.worker)
    }
    const schedule = []

    startTime.setHours(14)
    startTime.setMinutes(0)
    endTime.setHours(14)
    endTime.setMinutes(0)
    endTime.setHours(endTime.getHours() + durationH)
    endTime.setMinutes(endTime.getMinutes() + durationM)
    console.log(nextDay)
    while (endTime < nextDay) {
        const available = []
        for (const w of workers) {
            available.push(await getWorkerStatusByTime(startTime, endTime, w))
        }
        startTime.setMinutes(startTime.getMinutes() + 10)
        endTime.setMinutes(endTime.getMinutes() + 10)
        if (!available.includes(false)) {
            schedule.push([new Date(startTime), new Date(endTime)])
        }
    }
    console.log(schedule)
    return schedule
}*/

export const findPerformanceReplacement = async (performanceId, show) => {
    const performance = Performance.find({_id: performanceId})
    return Performance.find({show : show, performanceTime: {$gte: performance.performanceTime}})
}
export const findPerformanceSlot = async (date, showId, interval, workers) => {

    date.setHours(0)
    date.setMinutes(0)
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    const startTime = new Date(date)
    interval = new Date(`2000-01-01T00:${interval}:00.000Z`)

    const show = await Show.findById(showId)

    const durationH = show.duration.getHours()
    const durationM = show.duration.getMinutes()

    const endTime = new Date(startTime)

    const schedule = []

    startTime.setHours(14)
    startTime.setMinutes(0)
    endTime.setHours(14)
    endTime.setMinutes(0)
    endTime.setHours(endTime.getHours() + durationH)
    endTime.setMinutes(endTime.getMinutes() + durationM)


        while (endTime < nextDay) {
            const available = []
            for (const w of workers) {
                available.push(await getWorkerStatusByTime(startTime, endTime, w))
            }
            startTime.setMinutes(startTime.getMinutes() + interval.getMinutes())
            endTime.setMinutes(endTime.getMinutes() + interval.getMinutes())
            if (!available.includes(false)) {
                schedule.push([new Date(startTime), new Date(endTime)])
            }
        }


    return schedule
}


export const createReplacementPerformance = async (oldPerformanceId, showId, hallId, time, details, userId, performanceAvatarUrl, prices) => {
    const newPerformance = await createPerformanceWithTicketsAndSession(showId, hallId, time, details, userId, performanceAvatarUrl)
    await createTickets(newPerformance, hallId, prices)
    await replaceTickets(oldPerformanceId, newPerformance._id)
    const newTickets = await getSoldTicketsForPerformance(newPerformance._id)

    for(const t of newTickets){
        await sendReplacementEmail(t.owner.email, oldPerformanceId, newPerformance._id)
    }
    return newPerformance
}
export const getPerformance = async (id) => {
    return Performance.findOne({_id: id}).populate("hall").populate("show")
}


export const getPerformances = async () => {
    let now = new Date()
    now = now.toISOString().split('T')[0]
    return Performance.find({performanceTime: {$gte: now}}).sort({performanceTime: 1}).populate("hall").populate("show")
}

export const deletePerformance = async (id) => {
    await Performance.findOneAndDelete({
        _id: id,
    })
    const tickets = await Ticket.find({performance: id})
    const sessions = await workSession.find({performance: id})
    for (const t of tickets){
        await Ticket.deleteOne(t)
    }
    for (const s of sessions) {
        await workSession.deleteOne(s)
    }

}