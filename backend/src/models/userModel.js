import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        verified: {
            type: Boolean,
            default: false,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "organizer", "admin"],
            default: "user",
        },

    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("User", userSchema)

export default userModel;