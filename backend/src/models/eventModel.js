import mongoose from "mongoose";

const ticketTierSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    capacity: { type: Number },
    description: { type: String, trim: true },
    sold: { type: Number, default: 0 },
});

const eventSchema = new mongoose.Schema({

    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    date: { type: Date, required: true },

    startTime: { type: String, required: true },

    endTime: { type: String, required: true },

    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        geo: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
    },

    priceType: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
    },

    price: { type: Number, default: 0 },

    ticketTiers: [ticketTierSchema],

    images: [String],

    tags: [String],

    views: { type: Number, default: 0 },

    bookmarks: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },

    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected"
        ],
        default: "approved",
    },

    isFeatured: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected"
        ],
        default: "pending",
    },

    rejectionReason: {
        type: String,
        default: "",
    },
});

eventSchema.index({ title: "text", description: "text", tags: "text" });

const Event = mongoose.model("Event", eventSchema);

export default Event;