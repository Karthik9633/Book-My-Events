import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!otp.trim()) return showToast("Enter OTP", "error");
        if (password.length < 8) return showToast("Password must be at least 8 characters", "error");
        if (password !== confirmPassword) return showToast("Passwords do not match", "error");

        try {
            setLoading(true);
            await API.post("/auth/reset-password", { email, otp, password });
            showToast("Password updated successfully", "success");
            navigate("/login");
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to reset password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-purple-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8">

                {/* Icon */}
                <div className="flex justify-center mb-5 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center">
                        <ShieldCheck size={30} className="text-purple-700" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Reset Password</h1>
                <p className="text-gray-500 text-center mb-6 sm:mb-8 text-sm sm:text-base">
                    Enter OTP and create your new password
                </p>

                {/* OTP */}
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border rounded-full py-3 px-5 outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-sm sm:text-base"
                />

                {/* New Password */}
                <div className="relative mb-4">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-full py-3 pl-11 pr-11 outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 touch-manipulation"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative mb-6">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-full py-3 pl-11 pr-11 outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 touch-manipulation"
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Submit */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white py-3 rounded-full font-semibold transition duration-300 text-sm sm:text-base touch-manipulation"
                >
                    {loading ? "Updating..." : "Reset Password"}
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;