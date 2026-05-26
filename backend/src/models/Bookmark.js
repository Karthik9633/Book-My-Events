import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
},
    {
        timestamps: true,
    }
);


// PREVENT DUPLICATES
bookmarkSchema.index(
    {
        userId: 1,
        eventId: 1,
    },
    {
        unique: true,
    }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;