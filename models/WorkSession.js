import mongoose from "mongoose"

const WorkSessionSchema = new mongoose.Schema({
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        performance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Performance',
            required: true,
        },
        salary: {
            type: Number,
            required: true
        },
        role:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    });


export default mongoose.model("WorkSession", WorkSessionSchema);