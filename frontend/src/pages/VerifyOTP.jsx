import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(40);
    const inputsRef = useRef([]);

    useEffect(() => {
        if (!email) navigate("/signup");
    }, []);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    // Allow paste across all 6 boxes
    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        const updated = [...otp];
        pasted.split("").forEach((char, i) => { updated[i] = char; });
        setOtp(updated);
        const nextEmpty = updated.findIndex((v) => !v);
        inputsRef.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    };

    const verifyOTP = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            showToast("Enter OTP", "error");
            return;
        }
        try {
            setLoading(true);
            const response = await API.post("/auth/verify-otp", { email, otp: otpValue });
            showToast(response.data.message, "success");
            navigate("/login");
        } catch (error) {
            showToast(error.response?.data?.message || "OTP Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            await API.post("/auth/resend-otp", { email });
            setTimer(40);
            showToast("OTP Resent", "success");
        } catch {
            showToast("Failed", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-purple-200 flex flex-col">

            {/* Brand */}
            <div className="px-6 sm:px-16 py-6 sm:py-10 font-bold text-2xl sm:text-3xl text-purple-700">
                BookMyEvent
            </div>

            {/* Card */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-10">
                <div className="bg-white w-full max-w-sm sm:max-w-xl rounded-3xl shadow-xl p-6 sm:p-10 lg:p-12 relative">

                    {/* Back button */}
                    <button
                        onClick={() => navigate("/signup")}
                        className="absolute left-5 top-5 sm:left-8 sm:top-8 text-gray-500 hover:text-purple-600 transition touch-manipulation"
                    >
                        <ArrowLeft size={22} />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-purple-100 rounded-full flex items-center justify-center">
                            <ShieldCheck size={30} className="text-purple-600 sm:hidden" />
                            <ShieldCheck size={35} className="text-purple-600 hidden sm:block" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
                        Verify your email
                    </h1>
                    <p className="text-gray-500 text-center mb-1 text-sm sm:text-lg">
                        We've sent a 6-digit code
                    </p>
                    <p className="text-center font-semibold mb-7 sm:mb-10 text-base sm:text-xl truncate px-4">
                        {email}
                    </p>

                    {/* OTP inputs */}
                    <div className="flex justify-center gap-2 sm:gap-4 mb-7 sm:mb-10" onPaste={handlePaste}>
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputsRef.current[index] = el)}
                                value={value}
                                maxLength={1}
                                inputMode="numeric"
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleBackspace(e, index)}
                                className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-2 rounded-xl sm:rounded-2xl text-center text-lg sm:text-2xl font-bold outline-none focus:border-purple-600 transition touch-manipulation"
                            />
                        ))}
                    </div>

                    {/* Verify button */}
                    <button
                        onClick={verifyOTP}
                        disabled={loading}
                        className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white rounded-full py-4 sm:py-5 font-bold text-base sm:text-xl flex justify-center items-center gap-3 shadow-lg transition touch-manipulation"
                    >
                        {loading ? "Verifying..." : <><span>Verify</span><ArrowRight size={20} /></>}
                    </button>

                    {/* Resend */}
                    <div className="text-center mt-6 sm:mt-8 text-gray-500 text-sm sm:text-base">
                        Didn't receive code?{" "}
                        {timer > 0 ? (
                            <span className="text-purple-500 font-bold">
                                Resend ({timer}s)
                            </span>
                        ) : (
                            <button
                                onClick={resendOTP}
                                className="text-purple-700 font-bold hover:underline touch-manipulation"
                            >
                                Resend Code
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pb-6 sm:pb-8 text-center text-gray-500 text-xs sm:text-sm">
                © 2026 BookMyEvent
            </div>
        </div>
    );
};

export default VerifyOTP;