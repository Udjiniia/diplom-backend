import Hall from "../models/Hall.js";
import Performance from "../models/Performance.js";

export const createNewHall = async (name, rows, capacity, details, userId) => {
    const doc = new Hall({
        name: name,
        rows: rows,
        capacity: capacity,
        details: details,
        creator: userId,
    })

    return await doc.save()
}

export const getHalls = async () => {

    return Hall.find();
}

export const getHall = async (id) => {

    return Hall.findOne({_id: id});
}

export const getHallByUnName = async (name) => {

    return Hall.findOne({name: name});
}

export const checkHallAvailable = async (hall, date, start, end) => {
    date.setHours(0)
    date.setMinutes(0)
    const nextDay = new Date(date)
    const performances = Performance.find({hall: hall._id, performanceTime: {$gte: date, $lte: nextDay}})



}

export const updateHallById = async (name, rows, capacity, details, status, id) => {

    await Hall.findOneAndUpdate({
            _id: id,
        },
        {
            name: name,
            rows: rows,
            capacity: capacity,
            details: details,
            status: status
        })
    const hall = await Hall.findOne({_id: id})

    return hall
}

export const deleteHall = async (id) => {
    Hall.findOneAndDelete(
        {
            id,
        }),
        (err, doc) => {
            if (err) {
                console.log(err);
                return {
                    message: 'Couldn`t delete hall ',
                };
            }

            if (!doc) {
                return {
                    message: 'No such hall',
                };
            }

            return {success: true}
        }
}