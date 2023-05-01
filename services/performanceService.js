import Hall from "../models/Hall.js";
import Performance from "../models/Performance.js";

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

export const getTimeForShowByDate = async (date, show) => {
    date.setHours(14)
    date.setMinutes(0)
    date.setSeconds(0)

    let nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(0)


    const halls = await Hall.find()
    const performances = await Performance.find({performanceTime: {$gte: date, $lte: nextDay}})

    let schedule = {};

    nextDay.setHours(nextDay.getHours() - show.duration.getHours() - 1)
    nextDay.setMinutes( nextDay.getMinutes() - show.duration.getMinutes() )


    for (let h of halls) {
        let slots = []
        let busySlotsTimes = [new Date(date)]
        for (let p of performances) {
            if (p.hall._id.equals(h._id)) {
                busySlotsTimes.push(new Date((await p).performanceTime.setHours((await p).performanceTime.getHours() - 1))
                    , new Date((await p).performanceEndTime.setHours((await p).performanceEndTime.getHours() + 1)))
                if (busySlotsTimes[busySlotsTimes.length -1] >= nextDay){
                    busySlotsTimes.pop()
                }
            }
        }
        if (busySlotsTimes.length % 2 !== 0) {
            busySlotsTimes.push(new Date(nextDay))
        }
        console.log((await h).name)

        let freeSlots = []

        for (let i = 0; i < busySlotsTimes.length - 1; i += 2){
            freeSlots.push([busySlotsTimes[i], busySlotsTimes[i+1]])
        }

        console.log("busy",freeSlots)

        for (let i = 0; i < freeSlots.length; i ++){
            let startDate = new Date(freeSlots[i][0])
            let dateEnd = new Date(freeSlots[i][0])
            dateEnd.setHours(dateEnd.getHours() + show.duration.getHours())
            dateEnd.setMinutes(dateEnd.getMinutes() + show.duration.getMinutes())
            while (dateEnd <= freeSlots[i][1] && dateEnd <= nextDay)
            {
                dateEnd = new Date(startDate)
                dateEnd.setHours(dateEnd.getHours() + show.duration.getHours())
                dateEnd.setMinutes(dateEnd.getMinutes() + show.duration.getMinutes())
                if (dateEnd <= freeSlots[i][1]) {
                    slots.push([new Date(startDate), new Date(dateEnd)])
                }
                startDate.setMinutes(startDate.getMinutes() + 5)
        }

        }
        schedule[h.name] = slots
    }

    console.log(schedule)
    return schedule
}

