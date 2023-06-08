import {
    createNewUser,
    getUserByEmail,
    deleteUser,
    updateUserById,
    updateUserPassword,
    getEmployees,
    updateUserStatus,
    getUser, getWorkers, getWorkersActive
} from "../services/userService.js";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }


        const passwordUnhashed = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordUnhashed, salt);

        const user = await createNewUser(req.body.email, passwordHash, req.body.userRole, req.body.firstName, req.body.lastName, req.body.birthday, req.body.phone, req.body.avatarUrl, req.body.status)

        const {password, ...userData} = user._doc;

        res.json({userData});

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Registration failed, try another email or phone"
            }
        )
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const user = await getUserByEmail(req.body.email)

        if (!user) {
            return res.status(404).json({
                message: "Wrong email or password"
            })
        }


        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password)

        if (!isValidPassword || user.status !== "active") {
            return res.status(404).json({
                message: "Wrong email or password!!"
            })
        }

        const token = jwt.sign({
                _id: user._id,
                email: req.body.email,
                role: user.userRole
            }
            , "diplom", {
                expiresIn: '10d',
            });

        const {password, ...userData} = user._doc;

        res.json({userData, token});

    } catch
        (err) {
        console.log(err);
        res.status(500).json({
                message: "Login failed"
            }
        )
    }
};

export const profile = async (req, res) => {
    try {
        const user = await getUser(req.userId)
        if (!user) {
            return res.status(404).json({
                message: "No such user"
            })
        }

        const {password, ...userData} = user._doc;
        res.json({userData});

    } catch (err) {
        res.status(403).json({
            message: "Not authorized",
        })
    }
};

export const removeRrofile = async (req, res) => {
    try {
        await deleteUser(req.params.id)
        res.json()
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Could not delete user',
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }


        const user = await updateUserById(req.body.email, req.body.firstName, req.body.lastName, req.body.birthday, req.body.phone, req.body.avatarUrl, req.userId)

        const token = jwt.sign({
                _id: user._id,
                email: req.body.email,
                role: user.userRole
            }
            , "diplom", {
                expiresIn: '10d',
            });

        const {password, ...userData} = user._doc;
        res.json({...userData, token});

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Updating profile failed"
            }
        )
    }
};

export const updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const passwordUnhashed = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordUnhashed, salt);

        const user = await updateUserPassword(req.userId, passwordHash)

        const token = jwt.sign({
                _id: user._id,
                email: req.body.email,
                role: user.userRole
            }
            , "diplom", {
                expiresIn: '10d',
            });

        const {password, ...userData} = user._doc;
        res.json({...userData, token});

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Updating password failed"
            }
        )
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const users = await getEmployees()
        res.json(users);
    } catch (err) {
        res.status(403).json({
            message: "Couldn`t get the employees",
        })
    }
};

export const getAllWorkers = async (req, res) => {
    try {
        const users = await getWorkers()
        res.json(users);
    } catch (err) {
        res.status(403).json({
            message: "Couldn`t get the workers",
        })
    }
};

export const getAllActiveWorkers = async (req, res) => {
    try {
        const users = await getWorkersActive()
        res.json(users);
    } catch (err) {
        res.status(403).json({
            message: "Couldn`t get the workers",
        })
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await getUser(req.params.id)
        res.json(user);
    } catch (err) {
        res.status(403).json({
            message: "Couldn`t get the user",
        })
    }
};

export const updateStatus = async (req, res) => {
    try {
        const user = await updateUserStatus(req.params.id, req.body.status)
        const {password, ...userData} = user._doc;
        res.json({...userData});
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Updating status failed"
            }
        )
    }
};