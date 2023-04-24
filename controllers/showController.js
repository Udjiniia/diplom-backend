import {validationResult} from "express-validator";
import Show from "../models/Show.js";



export const createShow = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const doc = new Show({
            name: req.body.name,
            author: req.body.author,
            duration: req.body.duration,
            description: req.body.description,
            details: req.body.details,
            creator: req.userId,
            showAvatarUrl: req.body.showAvatarUrl,
        })

        const show = await doc.save();

        res.json(show);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Creation of the show failed, try another name"
            }
        )
    }
};

export const getAllShows = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const shows = await Show.find()

        if (shows.length === 0) {
            return res.status(404).json({
                message: "Shows list is empty"
            })
        }
        res.json(shows);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Couldn`t get list of shows"
            }
        )
    }
};

export const getShowById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const show = await Show.findOne({_id: req.params.id})

        if (!show) {
            return res.status(404).json({
                message: "No such show"
            })
        }

        res.json(show);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "This show doesn`t exist"
            }
        )
    }
};

export const updateShow = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await Show.findOneAndUpdate({
                _id: req.params.id,
            },
            {
                name: req.body.name,
                author: req.body.author,
                duration: req.body.duration,
                description: req.body.description,
                details: req.body.details,
                showAvatarUrl: req.body.showAvatarUrl,
            })

        const show = await Show.findById(req.params.id)

        res.json(show);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Updating data failed"
            }
        )
    }
};
export const removeShow = async (req, res) => {
    try {
        Show.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(404).json({
                        message: 'Couldn`t delete this show',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'No such show',
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
            message: 'Could not delete this show',
        });
    }
}