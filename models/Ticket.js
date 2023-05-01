import mongoose from "mongoose"

const TicketSchema = new mongoose.Schema({
        row: {
            type: Number,
            required: true,
        },
        seat: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum : ['free','sold','booked', 'in basket'],
            default: 'free',
            required: true,
        },
        price: {
            type: Number ,
            required: true,
        },
        performance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Performance',
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

    },
    {
        timestamps: true,
    });

export default mongoose.model("Ticket", TicketSchema);