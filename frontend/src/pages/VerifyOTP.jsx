import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import API from "../api/axios";
import { useToast } from "../context/ToastContext";

const VerifyOTP = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { showToast } = useToast();

    // ✅ Read email from router state passed by Signup page
    const email = location.state?.email;

    const [otp, setOtp] =
        useState(
            ["", "", "", "", "", ""]
        );

    const [loading, setLoading] =
        useState(false);

    const [timer, setTimer] =
        useState(40);

    const inputsRef =
        useRef([]);

    useEffect(() => {

        // ✅ Redirect back if no email in state (e.g. direct URL access)
        if (!email) {
            navigate("/signup");
        }

    }, []);

    useEffect(() => {

        if (timer <= 0) return;

        const interval =
            setInterval(() => {

                setTimer(
                    prev => prev - 1
                );

            }, 1000);

        return () => clearInterval(
            interval
        );

    }, [timer]);

    const handleChange =
        (value, index) => {

            if (
                !/^\d*$/.test(value)
            ) return;

            const updated = [
                ...otp
            ];

            updated[index] =
                value;

            setOtp(updated);

            if (
                value &&
                index < 5
            ) {

                inputsRef.current[
                    index + 1
                ]?.focus();

            }

        };

    const handleBackspace =
        (e, index) => {

            if (
                e.key === "Backspace"
                &&
                !otp[index]
                &&
                index > 0
            ) {

                inputsRef.current[
                    index - 1
                ]?.focus();

            }

        };

    const verifyOTP =
        async () => {

            const otpValue =
                otp.join("");

            if (
                otpValue.length !== 6
            ) {

                showToast(
                    "Enter OTP",
                    "error"
                );

                return;

            }

            try {

                setLoading(true);

                const response =
                    await API.post(
                        "/auth/verify-otp",
                        {
                            email,
                            otp: otpValue
                        });

                showToast(
                    response.data.message,
                    "success"
                );

                navigate("/login");

            }

            catch (error) {

                showToast(

                    error.response?.
                        data?.message ||

                    "OTP Failed",

                    "error"

                )

            }

            finally {

                setLoading(false);

            }

        };

    const resendOTP =
        async () => {

            try {

                await API.post(
                    "/auth/resend-otp",
                    { email }
                );

                setTimer(40);

                showToast(
                    "OTP Resent",
                    "success"
                );

            }

            catch {

                showToast(
                    "Failed",
                    "error"
                )

            }

        };

    return (

        <div className="
min-h-screen
bg-gradient-to-r
from-gray-100
to-purple-200
flex
flex-col
">

            <div className="
px-16
py-10
font-bold
text-3xl
text-purple-700
">

                EventHub

            </div>

            <div className="
flex-1
flex
items-center
justify-center
px-6
">

                <div className="
bg-white
w-full
max-w-xl
rounded-[32px]
shadow-xl
p-12
relative
">

                    <button

                        onClick={() =>
                            navigate("/signup")
                        }

                        className="
absolute
left-8
top-8
text-gray-500
"

                    >

                        <ArrowLeft />

                    </button>

                    <div className="
flex
justify-center
mb-8
">

                        <div className="
w-24
h-24
bg-purple-100
rounded-full
flex
items-center
justify-center
">

                            <ShieldCheck

                                size={35}

                                className="
text-purple-600
"

                            />

                        </div>

                    </div>

                    <h1 className="
text-5xl
font-bold
text-center
mb-4
">

                        Verify your email

                    </h1>

                    <p className="
text-gray-500
text-center
mb-2
text-lg
">

                        We've sent a
                        6-digit code

                    </p>

                    <p className="
text-center
font-semibold
mb-10
text-xl
">

                        {email}

                    </p>

                    <div className="
flex
justify-center
gap-4
mb-10
">

                        {

                            otp.map(

                                (value, index) => (

                                    <input

                                        key={index}

                                        ref={(el) =>
                                            inputsRef.current[
                                            index
                                            ] = el
                                        }

                                        value={value}

                                        maxLength={1}

                                        onChange={(e) =>

                                            handleChange(

                                                e.target.value,

                                                index

                                            )

                                        }

                                        onKeyDown={(e) =>

                                            handleBackspace(

                                                e,

                                                index

                                            )

                                        }

                                        className="
w-16
h-16
border-2
rounded-2xl
text-center
text-2xl
font-bold
outline-none

focus:border-purple-600

"
                                    />

                                )

                            )

                        }

                    </div>

                    <button

                        onClick={
                            verifyOTP
                        }

                        disabled={loading}

                        className="
w-full
bg-purple-700
hover:bg-purple-800
text-white
rounded-full
py-5
font-bold
text-xl

flex
justify-center
items-center
gap-3

shadow-lg

"

                    >

                        {

                            loading

                                ?

                                "Verifying..."

                                :

                                <>

                                    Verify

                                    <ArrowRight />

                                </>

                        }

                    </button>

                    <div className="
text-center
mt-8
text-gray-500
">

                        Didn't receive code?

                        {

                            timer > 0

                                ?

                                (

                                    <span
                                        className="
text-purple-500
font-bold
"
                                    >

                                        {" "}Resend
                                        ({timer}s)

                                    </span>

                                )

                                :

                                (

                                    <button

                                        onClick={
                                            resendOTP
                                        }

                                        className="
text-purple-700
font-bold
"

                                    >

                                        {" "}Resend Code

                                    </button>

                                )

                        }

                    </div>

                </div>

            </div>

            <div className="
pb-8
text-center
text-gray-500
text-sm
">

                © 2026 BookMyEvent

            </div>

        </div>

    )

};

export default VerifyOTP;