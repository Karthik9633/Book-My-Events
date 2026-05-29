import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(

    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        eventTitle: String,

        image: String,

        date: String,

        location: String,

        tier: Object,

        quantity: Number,

        total: Number,

        paymentId: String,

    },

    {
        timestamps: true
    }

);

const Ticket =

    mongoose.model(

        "Ticket",
        ticketSchema
    );

export default Ticket;