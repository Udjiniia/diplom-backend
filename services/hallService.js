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

    return Hall.find();
}

export const getHall = async (id) => {

    return Hall.findOne({_id: id});
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