import Performance from "../models/Performance.js";
import WorkSession from "../models/WorkSession.js";
import Show from "../models/Show.js";
import Hall from "../models/Hall.js";

export const createWorkSessionForPerformance = async (workerId, performanceId, role, salary) => {

    const doc = new WorkSession({
        worker: workerId,
        performance: performanceId,
        role: role,
        salary: salary
    })

    const workSession = await doc.save();

    return workSession
}

export const getWorkerScheduleByDate = async (date, workerId) => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    const dayPerformances = await Performance.find({
        performanceTime: {
            $gte: date,
            $lte: nextDay
        }
    }).sort({performanceTime: 1})

    const workerPerformances = await WorkSession.find({
        performance: {$in: dayPerformances},
        worker: workerId
    })

    const schedule = []
    for (const w of workerPerformances) {
        const performance = await Performance.findById(w.performance).sort({performanceTime: 1})
        const show = await Show.findById(performance.show)
        const hall = await Hall.findById(performance.hall)
        const data = {
            performance: performance,
            show: show.name,
            hall: hall.name,
            role:  w.role,
            salary:  w.salary
        }
        schedule.push(data)
    }

    return schedule
}

export const getWorkerStatusByTime = async (timeStart, timeEnd, workerId) => {
    const date = new Date(timeStart)
    date.setHours(0)
    date.setMinutes(0)
    const schedule =  await getWorkerScheduleByDate(date, workerId)

    const status = []
    for (const s of schedule) {
        if (timeStart >= s.performanceWorkTime && timeStart <= s.performanceWorkEndTime) {
            status.push(false)
        } else if (timeEnd >= s.performanceWorkTime && timeEnd <= s.performanceWorkEndTime) {
            status.push(false)
        } else if (timeStart <= s.performanceWorkTime && timeEnd >= s.performanceWorkEndTime) {
            status.push(false)
        }
    }

    return (status.length === 0)

}

export const getWorkerSessionsByPerformace = async (performanceId) => {
    return WorkSession.find({performance: performanceId}).populate("worker")
}
