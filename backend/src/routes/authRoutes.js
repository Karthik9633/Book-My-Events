import express from "express";
import { registerUser, loginUser, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../controllers/authController.js"


const router = express.Router()


// REGISTER
router.post("/register", registerUser)


// LOGIN
router.post("/login", loginUser)

//OTP Verification

router.post("/verify-otp", verifyOTP)

//Resend Opt

router.post("/resend-otp", resendOTP);

// Forgot Password

router.post("/forgot-password", forgotPassword);

// Reset Password

router.post("/reset-password", resetPassword);

export default router