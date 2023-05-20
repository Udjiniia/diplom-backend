import Show from "../models/Show.js";

export const createNewShow = async ( name, author,duration, description, details, creator, showAvatarUrl) => {

    const doc = new Show({
        name: name,
        author: author,
        duration: duration,
        description: description,
        details: details,
        creator: creator,
        showAvatarUrl: showAvatarUrl,
    })

    return await doc.save()
}

export const getShows = async () => {

    return Show.find().sort({name: 1});
}

export const getShow = async (id) => {

    return Show.findOne({_id: id});
}

export const updateShowById = async (name, author,duration, description, details, showAvatarUrl, id) => {

    await Show.findOneAndUpdate({
            _id: id,
        },
        {
            name: name,
            author: author,
            duration: duration,
            description: description,
            details: details,
            showAvatarUrl: showAvatarUrl,
        })
    const show = await Show.findOne({_id: id})

    return show
}

export const deleteShow = async (id) => {
    Show.findOneAndDelete(
        {
            id,
        }),
        (err, doc) => {
            if (err) {
                console.log(err);
                return {
                    message: 'Couldn`t delete show ',
                };
            }

            if (!doc) {
                return {
                    message: 'No such show',
                };
            }

            return {success: true}
        }
}