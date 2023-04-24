import mongoose from "mongoose"

const HallSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        capacity: {
            type: Number,
            required: true,
        },
        rows: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum : ['active','inactive'],
            default: 'active',
            required: true,
        },
        details: {
            type: String,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    });

export default mongoose.model("Hall", HallSchema);