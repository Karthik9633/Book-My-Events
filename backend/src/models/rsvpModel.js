import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["interested", "going"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate RSVP for same user and event
rsvpSchema.index(
  {
    user: 1,
    event: 1,
  },
  {
    unique: true,
  }
);

const RSVP = mongoose.model(
  "RSVP",
  rsvpSchema
);

export default RSVP;