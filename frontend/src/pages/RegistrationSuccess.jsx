import { CheckCircle, Download, Eye, Share2, Mail, MapPin, Calendar, Ticket, Copy } from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchEvent } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import { QRCodeCanvas } from "qrcode.react";

const RegistrationSuccess = () => {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [eventLoading, setEventLoading] = useState(true);
    const [copied, setCopied] = useState(false);

     useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);


    useEffect(() => {
        fetchEvent(id)
            .then(({ data }) => { if (data.success) setEvent(data.event); })
            .catch(console.error)
            .finally(() => setEventLoading(false));
    }, [id]);

    if (eventLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
    );
    if (!event) return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            Event not found
        </div>
    );

    const selectedTier = location.state?.tier;
    const quantity = location.state?.quantity || 1;
    const totalPrice = location.state?.total || 0;

    const image = event.images?.[0] || "https://picsum.photos/800/500";
    const venue = event.location
        ? `${event.location.address}, ${event.location.city}, ${event.location.state}`
        : "Venue TBD";
    const date = new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
    const time = new Date(event.date).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit",
    });

    const orderId = `EV-${event._id}`.toUpperCase();
    const qrValue = `Event: ${event.title}\nTicket: ${selectedTier?.name || "General Admission"}\nQty: ${quantity}\nUser: ${user?.name || "Guest"}\nOrder: ${orderId}`;

    const handleCopyOrder = async () => {
        try {
            await navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: event.title, text: `I'm going to ${event.title}! Join me.`, url: window.location.href });
            } catch { /* ignore */ }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-10">

            {/* ── Success Hero Banner ── */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white pt-14 pb-20 px-4 text-center relative overflow-hidden">
                {/* Background circles decorative */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-white/5 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3 pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                        <CheckCircle className="text-white" size={34} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight">
                        You're all set! 🎉
                    </h1>
                    <p className="text-purple-200 text-sm sm:text-base max-w-md mx-auto">
                        Your booking is confirmed. A ticket copy has been sent to{" "}
                        <span className="text-white font-semibold">{user?.email || "your email"}</span>
                    </p>

                    {/* Order ID chip */}
                    <button
                        onClick={handleCopyOrder}
                        className="mt-5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-sm font-mono font-semibold transition touch-manipulation"
                    >
                        <Ticket size={14} />
                        {orderId}
                        <Copy size={12} className={copied ? "text-green-300" : "text-white/60"} />
                    </button>
                    {copied && <p className="mt-1 text-xs text-green-300">Copied!</p>}
                </div>
            </div>

            {/* ── Ticket Card (overlaps banner) ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">

                {/* The "physical" ticket */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* Ticket top: image + details */}
                    <div className="flex flex-col sm:flex-row">

                        {/* Event image */}
                        <div className="sm:w-2/5 lg:w-1/3 h-56 sm:h-auto relative flex-shrink-0">
                            <img
                                src={image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Category pill */}
                            <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {event.category?.name || "Event"}
                            </div>
                        </div>

                        {/* Ticket info */}
                        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
                            <div>
                                <p className="text-xs font-bold text-purple-500 tracking-widest uppercase mb-2">
                                    Official Entry Pass
                                </p>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight mb-5">
                                    {event.title}
                                </h2>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Attendee</p>
                                        <p className="font-semibold text-gray-800">{user?.name || "Guest User"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Date</p>
                                        <p className="font-semibold text-gray-800">{date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ticket Type</p>
                                        <p className="font-semibold text-gray-800">{selectedTier?.name || "General Admission"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Quantity</p>
                                        <p className="font-semibold text-gray-800">× {quantity}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                            <MapPin size={11} /> Venue
                                        </p>
                                        <p className="font-semibold text-gray-800 text-sm leading-snug">{venue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticket tear line */}
                    <div className="relative flex items-center px-5 sm:px-7 py-1">
                        <div className="absolute -left-4 w-8 h-8 rounded-full bg-gray-50 border-r border-dashed border-gray-200" />
                        <div className="flex-1 border-t border-dashed border-gray-200" />
                        <div className="absolute -right-4 w-8 h-8 rounded-full bg-gray-50 border-l border-dashed border-gray-200" />
                    </div>

                    {/* QR + scan instructions */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 px-5 sm:px-7 py-5">
                        <div className="flex-shrink-0 p-3 border-2 border-purple-100 rounded-2xl bg-white shadow-sm">
                            <QRCodeCanvas
                                value={qrValue}
                                size={110}
                                bgColor="#ffffff"
                                fgColor="#1a1a2e"
                                level="H"
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-base mb-1">Scan at entry</p>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                                Present this QR code at the main gate. One scan per entry. Keep your ticket ready on your phone or printed.
                            </p>
                            <div className="mt-3 flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 w-fit">
                                <span className="text-xs font-mono font-bold text-purple-700">{orderId}</span>
                                <button onClick={handleCopyOrder} className="touch-manipulation">
                                    <Copy size={12} className={copied ? "text-green-500" : "text-purple-400"} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Grid: Order summary + actions ── */}
                <div className="mt-5 grid sm:grid-cols-2 gap-4 sm:gap-5">

                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                        <h3 className="font-bold text-gray-900 text-base mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Ticket Type</span>
                                <span className="font-medium text-gray-800">{selectedTier?.name || "General Admission"}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Quantity</span>
                                <span className="font-medium text-gray-800">{quantity}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Price per ticket</span>
                                <span className="font-medium text-gray-800">₹{selectedTier?.price ?? 0}</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total Charged</span>
                                <span className="font-extrabold text-purple-600 text-xl">₹{totalPrice.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {/* Email confirmation */}
                        <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-3 flex gap-3 items-start">
                            <Mail size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-purple-700">
                                Ticket & receipt sent to{" "}
                                <span className="font-bold">{user?.email || "your email"}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/mytickets"
                            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white py-4 rounded-xl font-bold text-sm sm:text-base transition shadow-md shadow-purple-200 touch-manipulation"
                        >
                            <Eye size={18} />
                            View My Tickets
                        </Link>

                        <button
                            className="flex items-center justify-center gap-2 bg-white border-2 border-purple-200 hover:border-purple-400 text-purple-700 py-4 rounded-xl font-bold text-sm sm:text-base transition touch-manipulation"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>

                        <button
                            onClick={handleNativeShare}
                            className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-4 rounded-xl font-semibold text-sm sm:text-base transition touch-manipulation"
                        >
                            <Share2 size={18} />
                            Share with Friends
                        </button>

                        <Link
                            to="/"
                            className="text-center text-sm text-gray-400 hover:text-purple-600 transition py-2"
                        >
                            ← Discover more events
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccess;