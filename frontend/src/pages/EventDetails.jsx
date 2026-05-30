import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EventMap from "../components/EventMap";
import { useAuth } from "../context/AuthContext";
import { fetchEvent, fetchRSVP, updateRSVP, createOrder } from "../api/eventApi";
import API from "../api/axios";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, registerTicket } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTierName, setSelectedTierName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [interested, setInterested] = useState(0);
    const [going, setGoing] = useState(0);
    const [userRSVP, setUserRSVP] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [showBookingSheet, setShowBookingSheet] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    useEffect(() => {
        fetchEvent(id)
            .then(({ data }) => { if (data.success) setEvent(data.event); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (event?.ticketTiers?.length) {
            setSelectedTierName(event.ticketTiers[0].name);
        }
    }, [event]);

    useEffect(() => {
        if (!event?.date) return;
        const timer = setInterval(() => {
            const diff = new Date(event.date).getTime() - Date.now();
            if (diff <= 0) { clearInterval(timer); return; }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
                minutes: Math.floor(diff / (1000 * 60)) % 60,
                seconds: Math.floor(diff / 1000) % 60,
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [event]);

    useEffect(() => {
        if (!user) return;
        fetchRSVP(id)
            .then(({ data }) => {
                setInterested(data.interested);
                setGoing(data.going);
                setUserRSVP(data.userStatus);
            })
            .catch(console.log);
    }, [id, user]);

    const handleRSVP = async (status) => {
        if (!user) { navigate("/login"); return; }
        try {
            const newStatus = userRSVP === status ? "none" : status;
            await updateRSVP(id, newStatus);
            const { data } = await fetchRSVP(id);
            setInterested(data.interested);
            setGoing(data.going);
            setUserRSVP(data.userStatus);
        } catch (error) { console.log(error); }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!event) return <div className="p-10 text-center">Event not found</div>;

    const image = event.images?.[0] || "https://picsum.photos/800/500";

    const date = new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
    });

    const venue = event.location
        ? `${event.location.address}, ${event.location.city}, ${event.location.state}`
        : "";

    const selectedTier = event.ticketTiers?.find((t) => t.name === selectedTierName) || null;

    const total = selectedTier ? quantity * selectedTier.price : 0;

    const remainingTickets = selectedTier
        ? (selectedTier.capacity || 0) - (selectedTier.sold || 0)
        : 0;

    const isSoldOut = remainingTickets <= 0;

    const shareUrl = window.location.href;

    const handleCopyLink = async () => {
        try { await navigator.clipboard.writeText(shareUrl); alert("Link copied!"); }
        catch { alert("Failed to copy"); }
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${event.title}\n${shareUrl}`)}`, "_blank");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try { await navigator.share({ title: event.title, text: event.description, url: shareUrl }); }
            catch (error) { console.log(error); }
        } else { handleCopyLink(); }
    };

    const handleRegister = async () => {
        if (!user) { navigate("/login"); return; }
        navigate("/order-summary", {
            state: {
                event,
                selectedTickets: [
                    {
                        name: selectedTier?.name || "General Admission",
                        price: selectedTier?.price || 0,
                        quantity,
                    }
                ],
            },
        });
        if (total === 0) {
            registerTicket({ id: Date.now(), eventId: event._id, eventTitle: event.title, image, date, location: venue, tier: selectedTier, quantity, total });
            navigate(`/success/${event._id}`, { state: { tier: selectedTier, quantity, total } });
            return;
        }
    };

    // Booking panel as JSX — NOT a nested component, just a variable
    const bookingPanel = (
        <>
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4 sm:mb-6">
                ₹ {total}
            </h2>

            <select
                value={selectedTierName}
                onChange={(e) => {
                    setSelectedTierName(e.target.value);
                    setQuantity(1);
                }}
                className="w-full border p-3 rounded-xl mb-4 text-sm sm:text-base"
            >
                {event.ticketTiers?.map((tier) => {
                    const remaining = (tier.capacity || 0) - (tier.sold || 0);
                    const soldOut = tier.capacity && remaining <= 0;
                    return (
                        <option key={tier._id} value={tier.name} disabled={soldOut}>
                            {soldOut ? "🔴" : remaining <= 10 ? "🟡" : "🟢"}{" "}
                            {tier.name}{" — ₹ "}{tier.price}
                            {soldOut ? " • Sold Out" : ""}
                        </option>
                    );
                })}
            </select>

            <div className="flex gap-4 text-xs text-gray-500 mb-4">
                <span>🟢 Available</span>
                <span>🟡 Few Left</span>
                <span>🔴 Sold Out</span>
            </div>

            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm sm:text-base">Quantity</p>
                    <p className={`text-xs sm:text-sm font-medium ${isSoldOut ? "text-red-600" : remainingTickets <= 10 ? "text-red-500" : "text-green-600"}`}>
                        {isSoldOut ? "Sold Out" : `${remainingTickets} left`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-full border text-xl font-bold disabled:opacity-30 hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
                    >
                        −
                    </button>
                    <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity((q) => Math.min(remainingTickets, q + 1))}
                        disabled={quantity >= remainingTickets}
                        className="w-10 h-10 rounded-full border text-xl font-bold disabled:opacity-30 hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                onClick={handleRegister}
                disabled={isSoldOut}
                className="w-full bg-purple-600 text-white rounded-xl py-4 font-bold text-base sm:text-lg disabled:opacity-50 hover:bg-purple-700 active:bg-purple-800 transition touch-manipulation"
            >
                {isSoldOut ? "Sold Out" : "Register Now"}
            </button>
        </>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-24 lg:pb-10">

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 text-sm text-gray-500 truncate">
                <Link to="/" className="hover:text-purple-600">Home</Link>
                {" > "}
                <span className="text-gray-800 font-medium line-clamp-1">{event.title}</span>
            </div>

            {/* Hero Image */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
                <img
                    src={image}
                    alt={event.title}
                    className="w-full h-[220px] sm:h-[320px] lg:h-[450px] rounded-2xl sm:rounded-3xl object-cover shadow-lg"
                />
            </div>

            {/* Main Grid */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 mt-6 sm:mt-10">

                {/* ── Left / Main Content ── */}
                <div className="lg:col-span-2">

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                        {event.title}
                    </h1>

                    <div className="mb-6 space-y-1 text-sm sm:text-base text-gray-700">
                        <p>📅 {date}</p>
                        <p>📍 {venue}</p>
                    </div>

                    {/* Community Interest */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 shadow">
                        <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Community Interest</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleRSVP("interested")}
                                className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl text-sm sm:text-base font-medium touch-manipulation transition
                                    ${userRSVP === "interested" ? "bg-pink-600 text-white" : "border hover:bg-gray-50"}`}
                            >
                                ❤️ Interested ({interested})
                            </button>
                            <button
                                onClick={() => handleRSVP("going")}
                                className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl text-sm sm:text-base font-medium touch-manipulation transition
                                    ${userRSVP === "going" ? "bg-green-600 text-white" : "border hover:bg-gray-50"}`}
                            >
                                ✅ Going ({going})
                            </button>
                        </div>
                    </div>

                    {/* Share */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">📤 Share Event</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <button onClick={handleWhatsApp} className="flex-1 min-w-[100px] bg-green-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 active:bg-green-800 transition touch-manipulation">WhatsApp</button>
                            <button onClick={handleCopyLink} className="flex-1 min-w-[100px] border border-gray-300 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 active:bg-gray-200 transition touch-manipulation">Copy Link</button>
                            <button onClick={handleNativeShare} className="flex-1 min-w-[100px] bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-purple-700 active:bg-purple-800 transition touch-manipulation">Share</button>
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="bg-purple-100 rounded-2xl p-4 sm:p-6 mb-6">
                        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                            {Object.entries(timeLeft).map(([k, v]) => (
                                <div key={k} className="bg-white/60 rounded-xl py-3 px-1">
                                    <p className="font-bold text-xl sm:text-2xl text-purple-700">{v}</p>
                                    <p className="text-xs sm:text-sm capitalize text-gray-600">{k}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About */}
                    <div className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About this event</h2>
                        <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                            {event.description}
                        </p>
                        <ul className="space-y-2 sm:space-y-3 text-gray-600">
                            {event.tags?.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                                    <span className="text-purple-600 font-bold mt-0.5">✔</span>
                                    {item.replace(/"/g, "").trim()}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <EventMap lat={event.location?.geo?.lat} lng={event.location?.geo?.lng} />
                </div>

                {/* ── Desktop Booking Sidebar ── */}
                <div className="hidden lg:block bg-white rounded-3xl p-8 shadow h-fit sticky top-24">
                    {bookingPanel}
                </div>
            </div>

            {/* ── Mobile Booking Bottom Bar ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl">
                {!showBookingSheet && (
                    <div className="flex items-center justify-between px-4 py-3 gap-3">
                        <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-xl font-bold text-purple-600">₹ {total}</p>
                        </div>
                        <button
                            onClick={() => setShowBookingSheet(true)}
                            disabled={isSoldOut}
                            className="flex-1 bg-purple-600 text-white rounded-xl py-3 font-bold text-base disabled:opacity-50 active:bg-purple-800 touch-manipulation"
                        >
                            {isSoldOut ? "Sold Out" : "Book Tickets"}
                        </button>
                    </div>
                )}

                {showBookingSheet && (
                    <div className="px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Book Tickets</h3>
                            <button
                                onClick={() => setShowBookingSheet(false)}
                                className="text-gray-400 hover:text-gray-700 text-2xl leading-none touch-manipulation"
                            >
                                ✕
                            </button>
                        </div>
                        {bookingPanel}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;