import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/eventApi";
import API from "../api/axios";
import { Calendar, MapPin, Shield, CreditCard, ArrowLeft, Smartphone, Wallet, ChevronRight, Lock } from "lucide-react";
import { useState, useEffect } from "react";




const OrderSummary = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { user } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const { event, selectedTickets } = state || {};
    if (!event) return <div className="p-10 text-center text-gray-500">No order found</div>;

    const image = event.images?.[0] || "https://picsum.photos/800/500";
    const date = new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
    const venue = event.location
        ? `${event.location.address}, ${event.location.city}, ${event.location.state}`
        : "Venue TBD";

    const subtotal = selectedTickets.reduce((sum, t) => sum + t.price * t.quantity, 0);
    const serviceFee = subtotal * 0.05;
    const tax = subtotal * 0.10;
    const total = subtotal + serviceFee + tax;

    const paymentMethods = [
        { id: "card", label: "Card", icon: <CreditCard size={18} /> },
        { id: "upi", label: "UPI", icon: <Smartphone size={18} /> },
        { id: "wallet", label: "Wallet", icon: <Wallet size={18} /> },
    ];

    const handlePayment = async () => {
        if (!user) { navigate("/login"); return; }
        setPaying(true);
        try {
            const selectedTier = selectedTickets[0];
            const liveTier = event.ticketTiers.find((t) => t.name === selectedTier.name);
            if (liveTier.capacity && liveTier.sold + selectedTier.quantity > liveTier.capacity) {
                alert(`Only ${liveTier.capacity - liveTier.sold} tickets remaining`);
                setPaying(false);
                return;
            }
            const { data } = await createOrder(Math.round(total));
            const order = data.order;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: "BookMyEvent",
                description: event.title,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        await API.post("/payments/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            eventId: event._id,
                            tierName: selectedTickets[0]?.name || "General Admission",
                            quantity: selectedTickets[0]?.quantity || 1,
                            total: Math.round(total),
                            userEmail: user.email,
                            userName: user.name,
                        }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
                    } catch (err) { console.log("Email sending failed:", err); }
                    navigate(`/success/${event._id}`, {
                        state: { tier: selectedTickets[0], quantity: selectedTickets[0]?.quantity || 1, total: Math.round(total) },
                    });
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#7C3AED" },
            };
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.log(error);
            alert("Payment failed");
        } finally {
            setPaying(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-32 lg:pb-16">

            {/* ── Top Header ── */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-purple-600 transition text-sm font-medium touch-manipulation"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <span className="text-lg sm:text-xl font-bold text-purple-600 tracking-tight">BookMyEvent</span>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 font-medium">
                        <Lock size={14} className="text-green-500" />
                        <span className="hidden sm:inline">Secure Checkout</span>
                    </div>
                </div>

                {/* Step indicator */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <span className="text-purple-600 font-semibold">1. Review</span>
                    <ChevronRight size={12} />
                    <span className="text-purple-600 font-semibold">2. Pay</span>
                    <ChevronRight size={12} />
                    <span>3. Confirm</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 grid lg:grid-cols-3 gap-6 lg:gap-8">

                {/* ── Left Column ── */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-5">

                    {/* Event Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex flex-col sm:flex-row gap-0">
                            <div className="sm:w-48 lg:w-56 h-48 sm:h-auto flex-shrink-0">
                                <img
                                    src={image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-5 sm:p-6 flex flex-col justify-center">
                                <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 rounded-full px-3 py-1 mb-3 w-fit">
                                    {event.category?.name || "Event"}
                                </span>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                    {event.title}
                                </h2>
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={15} className="text-purple-500 flex-shrink-0" />
                                        <span>{date}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={15} className="text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{venue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Selection */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Ticket Selection</h3>
                        <div className="space-y-3">
                            {selectedTickets.map((ticket, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl p-4"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{ticket.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                            {ticket.quantity} × ₹{ticket.price.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <p className="font-bold text-purple-700 text-base sm:text-lg">
                                        ₹{(ticket.quantity * ticket.price).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {paymentMethods.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMethod(m.id)}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 border-2 transition text-sm font-semibold touch-manipulation
                                        ${selectedMethod === m.id
                                            ? "border-purple-600 bg-purple-50 text-purple-700"
                                            : "border-gray-200 text-gray-500 hover:border-purple-300"
                                        }`}
                                >
                                    {m.icon}
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Card input placeholder */}
                        {selectedMethod === "card" && (
                            <div className="mt-4 space-y-3">
                                <div className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50">
                                    Card number will be entered in Razorpay's secure modal
                                </div>
                            </div>
                        )}
                        {selectedMethod === "upi" && (
                            <div className="mt-4 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50">
                                UPI ID will be entered in Razorpay's secure modal
                            </div>
                        )}
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 px-1">
                        <div className="flex items-center gap-1.5">
                            <Shield size={14} className="text-green-500" /> SSL Encrypted
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Lock size={14} className="text-green-500" /> PCI Compliant
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CreditCard size={14} className="text-green-500" /> Razorpay Secured
                        </div>
                    </div>
                </div>

                {/* ── Desktop Order Summary Sidebar ── */}
                <div className="hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
                        <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-gray-800 font-medium">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Service Fee (5%)</span>
                                <span className="text-gray-800 font-medium">₹{serviceFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Tax (10%)</span>
                                <span className="text-gray-800 font-medium">₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-base">Total</span>
                                <span className="font-bold text-purple-600 text-2xl">
                                    ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={paying}
                            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-base transition shadow-md shadow-purple-200 touch-manipulation"
                        >
                            {paying ? "Processing…" : "Confirm & Pay"}
                        </button>

                        <p className="mt-4 text-xs text-center text-gray-400">
                            By continuing, you agree to our <span className="underline cursor-pointer">Terms</span> & <span className="underline cursor-pointer">Refund Policy</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Mobile Sticky Pay Bar ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Total (incl. fees)</p>
                        <p className="text-xl font-bold text-purple-600">
                            ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <button
                        onClick={handlePayment}
                        disabled={paying}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-base transition touch-manipulation"
                    >
                        {paying ? "Processing…" : "Confirm & Pay"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;