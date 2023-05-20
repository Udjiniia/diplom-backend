import {validationResult} from "express-validator";
import {createNewShow, getShow, getShows, deleteShow, updateShowById} from "../services/showService.js";


export const createShow = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const show = await createNewShow(req.body.name, req.body.author, req.body.duration, req.body.description, req.body.details, req.userId, req.body.showAvatarUrl,)

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

        const shows = await getShows()

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

        const show = await getShow(req.params.id)

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

        const show = await updateShowById(req.body.name, req.body.author, req.body.duration, req.body.description, req.body.details, req.body.showAvatarUrl, req.params.id)

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
       await deleteShow(req.params.id)
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Could not delete this show',
        });
    }
}