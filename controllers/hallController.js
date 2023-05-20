import {validationResult} from "express-validator";
import {createNewHall, getHalls, getHall, updateHallById, deleteHall} from "../services/hallService.js";


export const createHall = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const hall = await createNewHall(req.body.name, req.body.rows, req.body.capacity, req.body.details, req.userId,)

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

        const halls = await getHalls()

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

        const hall = await getHall(req.params.id)

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

        const hall = await updateHallById(req.body.name, req.body.rows, req.body.capacity, req.body.details, req.body.status, req.params.id)

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
        const resp = await deleteHall(req.params.id)
        res.json(resp)
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Could not delete hall',
        });
    }

}