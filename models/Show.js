import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        duration: {
            type: Date,
            required: true,
        },
        details: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        showAvatarUrl: String,
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,

    });


ShowSchema.index({ "name": 1, "author": 1 }, { unique: true })
export default mongoose.model("Show", ShowSchema);