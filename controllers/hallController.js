import {validationResult} from "express-validator";
import Hall from "../models/Hall.js";



export const createHall = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const doc = new Hall({
            name: req.body.name,
            rows: req.body.rows,
            capacity: req.body.capacity,
            details: req.body.details,
            creator: req.userId,
        })

        const hall = await doc.save();

        res.json(hall);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Creation of the hall failed, try another name"
            }
        )
    }
};

export const getAllHalls = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const halls = await Hall.find()

        if (halls.length === 0) {
            return res.status(404).json({
                message: "Halls list is empty"
            })
        }
        res.json(halls);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get list of halls"
            }
        )
    }
};

export const getHallById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const hall = await Hall.findOne({_id: req.params.id})

        if (!hall) {
            return res.status(404).json({
                message: "No such hall"
            })
        }

        res.json(hall);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "This hall doesn`t exist"
            }
        )
    }
};

export const updateHall = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await Hall.findOneAndUpdate({
                _id: req.params.id,
            },
            {
                name: req.body.name,
                rows: req.body.rows,
                capacity: req.body.capacity,
                details: req.body.details,
            })

        const hall = await Hall.findById(req.params.id)

        res.json(hall);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Updating data failed"
            }
        )
    }
};
export const removeHall = async (req, res) => {
    try {
        Hall.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(404).json({
                        message: 'Couldn`t delete hall ',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'No such hall',
                    });
                }

                res.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Could not delete hall',
        });
    }
}