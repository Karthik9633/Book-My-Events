import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import OTP from "../models/otpModel.js";
import otpGenerator from "otp-generator"
import sendEmail from "../utils/sendEmail.js"


// REGISTER USER
export const registerUser = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });

        if (existing && existing.verified) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = otpGenerator.generate(6,
            {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false

            }
        );

        await OTP.deleteMany({ email });
        await OTP.create({
            email, otp, expiresAt:

                new Date(

                    Date.now()

                    +

                    10 * 60 * 1000

                ),

            signupData: { name, email, password: hashedPassword, role }

        });

        await sendEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent"
        });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message

        });

    }

};



// LOGIN USER
export const loginUser = async (req, res) => {

    try {

        console.log(req.body);

        const {
            email,
            password
        } = req.body;



        // FIND USER
        const user =
            await User.findOne({
                email,
            });

        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        if (!user.verified) {

            return res.status(401).json({

                success: false,

                message:
                    "Verify email first"

            });

        }



        // CHECK PASSWORD
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }



        // RESPONSE
        res.json({

            success: true,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },

            token:
                generateToken(
                    user.id,
                    user.role
                ),
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyOTP = async (req, res) => {

    try {
        const { email, otp } = req.body;
        const otpData = await OTP.findOne({ email, otp });

        if (!otpData) {
            return res.status(400).json({
                message: "Invalid OTP"
            });

        }

        if (otpData.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            });

        }

        const existing = await User.findOne({ email });

        if (!existing) {
            await User.create(otpData.signupData);
        }

        else {
            await User.updateOne({ email }, { verified: true });

        }
        await User.updateOne({ email }, { verified: true }

        );

        await OTP.deleteMany({

            email

        });

        res.json({

            success: true,

            message:

                "Email verified"

        });

    }

    catch (error) {

        res.status(500)

            .json({

                message:

                    error.message

            });

    }

};

export const resendOTP = async (req, res) => {

    try {
        const { email } = req.body;

        const otpData = await OTP.findOne({ email });

        if (!otpData) {

            return res.status(404).json({
                success: false,
                message: "Signup again"

            });

        }

        const otp = otpGenerator.generate(6,
            {

                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false

            }

        );

        otpData.otp = otp;
        otpData.expiresAt =

            new Date(
                Date.now()
                +
                10 * 60 * 1000
            );

        await otpData.save();
        await sendEmail(email, otp);

        res.json({ success: true, message: "OTP resent" });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message

        });

    }

};

export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user =

            await User.findOne({

                email

            });

        if (!user) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:

                        "User not found"

                });

        }

        const otp =

            otpGenerator.generate(

                6,

                {

                    upperCaseAlphabets: false,

                    lowerCaseAlphabets: false,

                    specialChars: false

                }

            );

        await OTP.deleteMany({

            email

        });

        await OTP.create({

            email,

            otp,

            expiresAt:

                new Date(

                    Date.now()

                    +

                    10 * 60 * 1000

                ),

            signupData: null

        });

        await sendEmail(

            email,

            otp

        );

        res.json({

            success: true,

            message:

                "Reset OTP sent"

        });

    }

    catch (error) {

        res.status(500)

            .json({

                success: false,

                message:

                    error.message

            });

    }

};



export const resetPassword = async (req, res) => {

    try {

        const {

            email,

            otp,

            password

        } = req.body;

        const otpData =

            await OTP.findOne({

                email,

                otp

            });

        if (!otpData) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:

                        "Invalid OTP"

                });

        }

        if (

            otpData.expiresAt

            <

            new Date()

        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:

                        "OTP expired"

                });

        }

        const salt =

            await bcrypt.genSalt(10);

        const hashed =

            await bcrypt.hash(

                password,

                salt

            );

        await User.updateOne(

            {

                email

            },

            {

                password: hashed

            }

        );

        await OTP.deleteMany({

            email

        });

        res.json({

            success: true,

            message:

                "Password updated"

        });

    }

    catch (error) {

        res.status(500)

            .json({

                success: false,

                message: error.message

            });

    }

};