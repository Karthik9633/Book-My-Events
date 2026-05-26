import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { showToast } = useToast();

    const submit = async () => {
        if (!email) {
            showToast("Enter email", "error");

            return;
        }

        try {
            setLoading(true);

            await API.post(
                "/auth/forgot-password",

                { email }
            );

            showToast(
                "Reset OTP sent",

                "success"
            );

            navigate(
                "/reset-password",

                {
                    state: { email },
                }
            );
        } catch (error) {
            showToast(
                error.response?.data?.message || "Failed",

                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
min-h-screen
bg-gray-50
flex
items-center
justify-center
px-4
"
        >
            <div
                className="
bg-white
w-full
max-w-md
rounded-3xl
shadow-xl
p-8
"
            >
                <h1
                    className="
text-3xl
font-bold
mb-2
"
                >
                    Forgot Password
                </h1>

                <p
                    className="
text-gray-500
mb-8
"
                >
                    Enter email to receive OTP
                </p>

                <div
                    className="
flex
items-center
border
rounded-full
px-4
py-3
mb-6
"
                >
                    <Mail
                        size={18}
                        className="
text-gray-400
mr-3
"
                    />

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
w-full
outline-none
bg-transparent
"
                    />
                </div>

                <button
                    onClick={submit}
                    disabled={loading}
                    className="
w-full
bg-purple-700
hover:bg-purple-800
text-white
rounded-full
py-3
font-semibold
"
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
