import Hall from "../models/Hall.js";

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

    return Hall.find().sort({status: 1});
}

export const getHall = async (id) => {

    return Hall.findOne({_id: id});
}

export const getHallByUnName = async (name) => {

    return Hall.findOne({name: name});
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
    return await Hall.findOne({_id: id})
}

export const deleteHall = async (id) => {
    await Hall.findOneAndDelete({
        _id: id,
    })
}