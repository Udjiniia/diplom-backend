import User from "../models/User.js";

export const createNewUser = async (email, password, role, firstName, lastName, birthday, phone, avatarUrl, status) => {

    const doc = new User({
        email: email,
        password: password,
        userRole: role,
        firstName: firstName,
        lastName: lastName,
        birthday: new Date(birthday),
        phone: phone,
        avatarUrl: avatarUrl,
        status: status
    })

    return await doc.save()
}

export const getUserByEmail = async (email) => {

    return User.findOne({email: email});
}

export const getUser = async (id) => {

    return User.findOne({_id: id});
}

export const updateUserById = async (email, firstName, lastName, birthday, phone, avatarUrl, id) => {

    await User.findOneAndUpdate({
            _id: id,
        },
        {
            email: email,
            firstName: firstName,
            lastName: lastName,
            birthday: new Date(birthday),
            phone: phone,
            avatarUrl: avatarUrl
        })
    return await User.findOne({_id: id})
}

export const updateUserPassword = async (id, password) => {

    await User.findOneAndUpdate({
            _id: id,
        },
        {
            password: password,
        })

    return await User.findOne({_id: id})
}

export const deleteUser = async (id) => {
    User.findOneAndDelete(
        {
            id,
        }),
        (err, doc) => {
            if (err) {
                console.log(err);
                return {
                    message: 'Couldn`t delete the user',
                };
            }

            if (!doc) {
                return {
                    message: 'No such user',
                };
            }

            return {success: true}
        }
}

export const getEmployees = async () => {
    return User.find({userRole: {$in: ['admin', 'worker']}}).sort({status: 1}).sort({userRole: 1});
}

export const getWorkers = async () => {
    return User.find({userRole: {$in: ['worker']}}).sort({status: 1});
}
export const getWorkersActive = async () => {
    return User.find({userRole: {$in: ['worker']}, status: "active"});
}




export const updateUserStatus = async (id, status) => {

    await User.findOneAndUpdate({
            _id: id,
        },
        {
            status: status,
        })

    const user = await User.findOne({_id: id})

    return user
}