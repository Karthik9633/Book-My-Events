import { Eye, EyeOff, Mail, Lock, User, Briefcase, Users, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Signup = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    const { showToast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const [terms, setTerms] = useState(false);
    const [errors, setErrors] = useState({});

    const { signup } = useAuth();
    const navigate = useNavigate();

    // Reset form fields when switching role
    const handleRoleSwitch = (newRole) => {
        if (newRole === role) return;
        setRole(newRole);
        setName("");
        setEmail("");
        setPassword("");
        setTerms(false);
        setErrors({});
        setShowPassword(false);
    };

    const validate = (field, value) => {
        let newErrors = { ...errors };

        if (field === "name") {
            if (!value.trim()) {
                newErrors.name = "Full name is required";
            } else if (value.trim().length < 5) {
                newErrors.name = "Name must be at least 5 characters";
            } else {
                delete newErrors.name;
            }
        }

        if (field === "email") {
            if (!value) {
                newErrors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = "Enter a valid email address";
            } else {
                delete newErrors.email;
            }
        }

        if (field === "password") {
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!value) {
                newErrors.password = "Password is required";
            } else if (!passwordRegex.test(value)) {
                newErrors.password =
                    "Password must be 8+ characters and include uppercase, lowercase, number & special character";
            } else {
                delete newErrors.password;
            }
        }

        if (field === "terms") {
            if (!value) {
                newErrors.terms = "You must agree to the Terms of Service";
            } else {
                delete newErrors.terms;
            }
        }

        setErrors(newErrors);
    };

    const isFormValid =
        name &&
        email &&
        password &&
        terms &&
        !errors.name &&
        !errors.email &&
        !errors.password &&
        !errors.terms;

    const handleSignup = async () => {
        if (!isFormValid) return;

        const response = await signup(name, email, password, role);

        if (response.success) {
            showToast("OTP sent to your email. Please verify to complete signup.", "success");
            navigate("/verify-otp", { state: { email } });
        } else {
            showToast(response.message, "error");
        }
    };

    const isOrganizer = role === "organizer";

    // Left panel content changes based on role
    const panelContent = {
        user: {
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
            heading: "Discover the pulse of your city.",
            subtext: "Join a community of enthusiasts and never miss out on the most exciting local events.",
            badge: "10k+",
            badgeText: "Joined by over 10,000 local event lovers",
            stats: null,
        },
        organizer: {
            image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
            heading: "Scale Your Vision Beyond Limits.",
            subtext: "Join 5,000+ top event professionals using BookMyEvent to sell tickets, manage logistics, and grow their community in real-time.",
            badge: null,
            badgeText: null,
            stats: [
                { icon: <Users size={22} />, value: "2.4M", label: "Annual Attendees" },
                { icon: <TrendingUp size={22} />, value: "150%", label: "Avg. Growth Rate" },
            ],
        },
    };

    const panel = isOrganizer ? panelContent.organizer : panelContent.user;

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* LEFT SIDE — animates content when role switches */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    key={role + "-img"}
                    src={panel.image}
                    alt="Event"
                    className="w-full h-screen object-cover transition-all duration-700"
                    style={{ animation: "fadeIn 0.7s ease" }}
                />
                <div
                    className={`absolute inset-0 flex flex-col justify-between p-16 text-white transition-all duration-700 ${isOrganizer
                        ? "bg-gradient-to-b from-violet-900/85 to-indigo-950/95"
                        : "bg-gradient-to-b from-purple-700/80 to-purple-900/90"
                        }`}
                >
                    {/* Brand */}
                    <h2 className="text-2xl font-semibold">BookMyEvent</h2>

                    {/* Center content */}
                    <div>
                        {isOrganizer && (
                            <span className="inline-block bg-purple-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                                Organizers Only
                            </span>
                        )}
                        <h1
                            key={role + "-heading"}
                            className="text-5xl font-extrabold leading-tight mb-6"
                            style={{ animation: "slideUp 0.5s ease" }}
                        >
                            {panel.heading}
                        </h1>
                        <p
                            key={role + "-sub"}
                            className="text-lg opacity-90 mb-10 max-w-sm"
                            style={{ animation: "slideUp 0.6s ease" }}
                        >
                            {panel.subtext}
                        </p>

                        {/* User badge */}
                        {panel.badge && (
                            <div className="flex items-center gap-4">
                                <div className="bg-white text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    {panel.badge}
                                </div>
                                <span>{panel.badgeText}</span>
                            </div>
                        )}

                        {/* Organizer stats */}
                        {panel.stats && (
                            <div
                                className="flex gap-10"
                                style={{ animation: "slideUp 0.7s ease" }}
                            >
                                {panel.stats.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="bg-white/15 p-3 rounded-xl text-white">
                                            {s.icon}
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{s.value}</p>
                                            <p className="text-sm opacity-75">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom spacer */}
                    <div />
                </div>

                <style>{`
                    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
                `}</style>
            </div>

            {/* RIGHT FORM */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 bg-gray-50">
                <div className="w-full max-w-md">

                    {/* ROLE TOGGLE — replaces the dropdown */}
                    <div className="flex bg-white border border-gray-200 rounded-full p-1 mb-8 shadow-sm">
                        <button
                            onClick={() => handleRoleSwitch("user")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!isOrganizer
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            <User size={15} />
                            Attendee
                        </button>
                        <button
                            onClick={() => handleRoleSwitch("organizer")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isOrganizer
                                ? "bg-gradient-to-r from-violet-600 to-indigo-700 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            <Briefcase size={15} />
                            Organizer
                        </button>
                    </div>

                    {/* HEADING — changes with role */}
                    <h1 className="text-3xl font-bold mb-2 transition-all duration-300">
                        {isOrganizer ? "Create organizer account" : "Create your account"}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {isOrganizer
                            ? "Start creating and managing events for thousands of attendees."
                            : "Start exploring events happening near you today."}
                    </p>

                    {/* FULL NAME */}
                    <div className="mb-5">
                        <label className="text-sm font-medium">Company Name</label>
                        <div className="flex items-center border rounded-full px-4 py-3 mt-2 bg-white">
                            <User size={18} className="text-gray-400 mr-3" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    validate("name", e.target.value);
                                }}
                                placeholder="Enter Your Company Name"
                                className="w-full outline-none bg-transparent"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-2 ml-2">{errors.name}</p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div className="mb-5">
                        <label className="text-sm font-medium">Email Address</label>
                        <div className="flex items-center border rounded-full px-4 py-3 mt-2 bg-white">
                            <Mail size={18} className="text-gray-400 mr-3" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    validate("email", e.target.value);
                                }}
                                placeholder="name@example.com"
                                className="w-full outline-none bg-transparent"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-2 ml-2">{errors.email}</p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-5">
                        <label className="text-sm font-medium">Password</label>
                        <div className="flex items-center border rounded-full px-4 py-3 mt-2 bg-white">
                            <Lock size={18} className="text-gray-400 mr-3" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validate("password", e.target.value);
                                }}
                                placeholder="••••••••"
                                className="w-full outline-none bg-transparent"
                            />
                            {showPassword ? (
                                <EyeOff size={18} className="cursor-pointer text-gray-400" onClick={() => setShowPassword(false)} />
                            ) : (
                                <Eye size={18} className="cursor-pointer text-gray-400" onClick={() => setShowPassword(true)} />
                            )}
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-2 ml-2">{errors.password}</p>
                        )}
                    </div>

                    {/* TERMS */}
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={terms}
                            onChange={(e) => {
                                setTerms(e.target.checked);
                                validate("terms", e.target.checked);
                            }}
                            className="accent-purple-600"
                        />
                        I agree to the{" "}
                        <span className="text-purple-600 cursor-pointer">Terms of Service</span>
                    </div>
                    {errors.terms && (
                        <p className="text-red-500 text-xs mb-4 ml-2">{errors.terms}</p>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                        onClick={handleSignup}
                        disabled={!isFormValid}
                        className={`w-full mt-4 text-white py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${isOrganizer
                            ? "bg-gradient-to-r from-violet-600 to-indigo-700"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600"
                            } ${!isFormValid ? "opacity-50 cursor-not-allowed" : "hover:shadow-purple-200 hover:shadow-xl"}`}
                    >
                        {isOrganizer ? "Create Organizer Account" : "Create Account"}
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-purple-600 font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;