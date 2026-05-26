import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    ShieldCheck,
} from "lucide-react";

import API from "../api/axios";
import { useToast } from "../context/ToastContext";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const submit = async () => {
        if (!otp.trim()) {
            return showToast("Enter OTP", "error");
        }

        if (password.length < 8) {
            return showToast(
                "Password must be at least 8 characters",
                "error"
            );
        }

        if (password !== confirmPassword) {
            return showToast(
                "Passwords do not match",
                "error"
            );
        }

        try {
            setLoading(true);

            await API.post(
                "/auth/reset-password",
                {
                    email,
                    otp,
                    password,
                }
            );

            showToast(
                "Password updated successfully",
                "success"
            );

            navigate("/login");
        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Failed to reset password",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const inputStyle =
        "w-full border rounded-full py-3 outline-none focus:ring-2 focus:ring-purple-500";

    const passwordInputStyle =
        `${inputStyle} pl-12 pr-12`;

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-purple-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                        <ShieldCheck
                            size={34}
                            className="text-purple-700"
                        />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-2">
                    Reset Password
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Enter OTP and create your new password
                </p>

                {/* OTP */}
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) =>
                        setOtp(e.target.value)
                    }
                    className={`${inputStyle} px-5 mb-4`}
                />

                {/* Password */}
                <div className="relative mb-4">
                    <Lock
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                    />

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        className={passwordInputStyle}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                        className="absolute right-4 top-3.5 text-gray-500"
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative mb-6">
                    <Lock
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                    />

                    <input
                        type={
                            showConfirm
                                ? "text"
                                : "password"
                        }
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                        className={passwordInputStyle}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirm(
                                !showConfirm
                            )
                        }
                        className="absolute right-4 top-3.5 text-gray-500"
                    >
                        {showConfirm ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {/* Button */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white py-3 rounded-full font-semibold transition duration-300"
                >
                    {loading
                        ? "Updating..."
                        : "Reset Password"}
                </button>

            </div>
        </div>
    );
};

export default ResetPassword;