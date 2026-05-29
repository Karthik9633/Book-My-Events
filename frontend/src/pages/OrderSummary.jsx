import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/eventApi";
import API from "../api/axios";
import { Calendar, MapPin, Clock, Shield, CreditCard } from "lucide-react";

const OrderSummary = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { user } = useAuth();

    const { event, selectedTickets } = state || {};

    if (!event) return <div className="p-10">No order found</div>;


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

    // ✅ Razorpay payment triggered from this page
    const handlePayment = async () => {
        if (!user) { navigate("/login"); return; }

        try {
            const selectedTier = selectedTickets[0];

            const liveTier = event.ticketTiers.find(
                (t) => t.name === selectedTier.name
            );

            if (
                liveTier.capacity &&
                liveTier.sold + selectedTier.quantity > liveTier.capacity
            ) {
                return alert(
                    `Only ${liveTier.capacity - liveTier.sold
                    } tickets remaining`
                );
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
                    // Verify payment + send ticket email
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
                        }, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")
                                    }`
                            }
                        });
                        console.log("Ticket email sent ✅");
                    } catch (err) {
                        console.log("Email sending failed:", err);
                    }

                    navigate(`/success/${event._id}`, {
                        state: {
                            tier: selectedTickets[0],
                            quantity: selectedTickets[0]?.quantity || 1,
                            total: Math.round(total),
                        },
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
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-20">

            {/* HEADER */}
            <div className="bg-purple-700 text-white px-10 py-5 flex justify-between items-center">
                <button onClick={() => navigate(-1)}>← Back</button>
                <h1 className="text-3xl font-bold">BookMyEvent</h1>
                <div>Secure Checkout</div>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 mt-10 px-6">

                <div className="lg:col-span-2 space-y-6">

                    {/* EVENT CARD */}
                    <div className="bg-white rounded-3xl shadow p-6 flex gap-6">
                        <img src={image} alt="" className="w-56 h-40 rounded-2xl object-cover" />
                        <div>
                            <h2 className="text-4xl font-bold mb-4">{event.title}</h2>
                            <div className="space-y-3 text-gray-600">
                                <p className="flex gap-2"><Calendar size={18} /> {date}</p>
                                <p className="flex gap-2"><MapPin size={18} /> {venue}</p>
                            </div>
                        </div>
                    </div>

                    {/* TICKET SELECTION */}
                    <div className="bg-white rounded-3xl shadow p-6">
                        <h3 className="text-2xl font-bold mb-6">Ticket Selection</h3>
                        <div className="space-y-4">
                            {selectedTickets.map((ticket, index) => (
                                <div key={index} className="bg-purple-50 rounded-2xl p-5 flex justify-between">
                                    <div>
                                        <h4 className="font-bold text-lg">{ticket.name}</h4>
                                        <p>{ticket.quantity} x ₹{ticket.price}</p>
                                    </div>
                                    <div className="font-bold text-xl text-purple-700">
                                        ₹{ticket.quantity * ticket.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PAYMENT METHOD (UI only) */}
                    <div className="bg-white rounded-3xl shadow p-6">
                        <h3 className="text-2xl font-bold mb-6">Payment Method</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <button className="border-2 border-purple-600 rounded-2xl p-6 flex flex-col items-center gap-2">
                                <CreditCard /> Card
                            </button>
                            <button className="border rounded-2xl p-6">UPI</button>
                            <button className="border rounded-2xl p-6">PayPal</button>
                        </div>
                    </div>

                </div>

                {/* ORDER SUMMARY SIDEBAR */}
                <div>
                    <div className="bg-white rounded-3xl shadow sticky top-28 p-8">
                        <h3 className="text-3xl font-bold mb-6">Order Summary</h3>

                        <div className="space-y-4 text-lg">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Service Fee (5%)</span>
                                <span>₹{serviceFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (10%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-3xl text-purple-700">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* ✅ Triggers Razorpay */}
                        <button
                            onClick={handlePayment}
                            className="mt-8 w-full bg-purple-700 text-white py-5 rounded-2xl font-bold text-xl hover:bg-purple-800"
                        >
                            Confirm & Pay
                        </button>

                        <div className="mt-6 flex gap-3 text-gray-500">
                            <Shield size={20} /> Secure Payment
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderSummary;