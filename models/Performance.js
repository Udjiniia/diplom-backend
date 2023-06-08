import mongoose from "mongoose";

const PerformanceSchema = new mongoose.Schema({
        performanceTime: {
            type: Date,
            required: true,
        },
        performanceEndTime: {
            type: Date,
            required: true,
        },
        performanceWorkTime: {
            type: Date,
            required: true,
        },
        performanceWorkEndTime: {
            type: Date,
            required: true,
        },
        details: {
            type: String,
        },
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Show',
            required: true,
        },
        hall: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hall',
            required: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        performanceAvatarUrl: String,
    },
    {
        timestamps: true,
    });

PerformanceSchema.index({ "performanceTime": 1, "hall": 1 }, { unique: true })
export default mongoose.model("Performance", PerformanceSchema);