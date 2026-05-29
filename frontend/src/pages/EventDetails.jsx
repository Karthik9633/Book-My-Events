import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EventMap from "../components/EventMap";
import { useAuth } from "../context/AuthContext";
import { fetchEvent, fetchRSVP, updateRSVP, createOrder } from "../api/eventApi";
import API from "../api/axios"; // ✅ needed for verify call

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, registerTicket } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [interested, setInterested] = useState(0);
    const [going, setGoing] = useState(0);
    const [userRSVP, setUserRSVP] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
        if (event?.ticketTiers?.length) setSelectedTier(event.ticketTiers[0]);
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

        // Free event — skip payment
        if (total === 0) {
            registerTicket({ id: Date.now(), eventId: event._id, eventTitle: event.title, image, date, location: venue, tier: selectedTier, quantity, total });
            navigate(`/success/${event._id}`, { state: { tier: selectedTier, quantity, total } });
            return;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <Link to="/">Home</Link> {" > "} {event.title}
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-6">
                <img src={image} alt={event.title} className="w-full h-[450px] rounded-3xl object-cover shadow-lg" />
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 px-6 mt-10">
                <div className="lg:col-span-2">
                    <h1 className="text-4xl font-bold mb-6">{event.title}</h1>

                    <div className="mb-8">
                        <p>📅 {date}</p>
                        <p>📍 {venue}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 mb-8 shadow">
                        <h3 className="font-bold text-xl mb-4">Community Interest</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleRSVP("interested")}
                                className={`px-5 py-3 rounded-xl ${userRSVP === "interested" ? "bg-pink-600 text-white" : "border"}`}
                            >
                                ❤️ Interested ({interested})
                            </button>
                            <button
                                onClick={() => handleRSVP("going")}
                                className={`px-5 py-3 rounded-xl ${userRSVP === "going" ? "bg-green-600 text-white" : "border"}`}
                            >
                                ✅ Going ({going})
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-bold mb-4">📤 Share Event</h3>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={handleWhatsApp} className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition">WhatsApp</button>
                            <button onClick={handleCopyLink} className="border border-gray-300 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">Copy Link</button>
                            <button onClick={handleNativeShare} className="bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">Share</button>
                        </div>
                    </div>

                    <div className="bg-purple-100 rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-4 gap-3 text-center">
                            {Object.entries(timeLeft).map(([k, v]) => (
                                <div key={k}>
                                    <p className="font-bold text-2xl">{v}</p>
                                    <p>{k}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">
                            About this event
                        </h2>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            {event.description}
                        </p>

                        <ul className="space-y-3 text-gray-600">
                            {event.tags?.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-purple-600 font-bold">
                                        ✔
                                    </span>

                                    {item.replace(/"/g, "").trim()}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <EventMap lat={event.location?.geo?.lat} lng={event.location?.geo?.lng} />
                </div>

                <div className="bg-white rounded-3xl p-8 shadow h-fit sticky top-24">
                    <h2 className="text-3xl font-bold text-purple-600 mb-6">₹ {total}</h2>

                    <select
                        value={selectedTier?.name || ""}
                        onChange={(e) => {

                            const tier = event.ticketTiers.find(
                                (t) => t.name === e.target.value
                            );

                            setSelectedTier(tier);

                            setQuantity(1);

                        }}
                        className="w-full border p-3 rounded-xl mb-4"
                    >
                        {event.ticketTiers?.map((tier) => {

                            const remaining =
                                (tier.capacity || 0) -
                                (tier.sold || 0);

                            const soldOut =
                                tier.capacity &&
                                remaining <= 0;

                            return (
                                <option
                                    key={tier._id}
                                    value={tier.name}
                                    disabled={soldOut}
                                >
                                    {
                                        soldOut
                                            ? "🔴"
                                            : remaining <= 10
                                                ? "🟡"
                                                : "🟢"
                                    }

                                    {" "}

                                    {tier.name}

                                    {" — ₹ "}

                                    {tier.price}

                                    {
                                        soldOut
                                            ? " • Sold Out"
                                            : ""
                                    }

                                </option>
                            );
                        })}
                    </select>

                    <div className="flex gap-4 text-xs text-gray-500 mb-4">

                        <span>
                            🟢 Available
                        </span>

                        <span>
                            🟡 Few Left
                        </span>

                        <span>
                            🔴 Sold Out
                        </span>

                    </div>

                    <div className="mb-6">

                        <div className="flex items-center justify-between mb-2">

                            <p className="font-semibold">
                                Quantity
                            </p>

                            <p className={`text-sm font-medium ${isSoldOut
                                ? "text-red-600"
                                : remainingTickets <= 10
                                    ? "text-red-500"
                                    : "text-green-600"
                                }`}>
                                {
                                    isSoldOut
                                        ? "Sold Out"
                                        : remainingTickets <= 10
                                            ? `Only ${remainingTickets} tickets left`
                                            : `${remainingTickets} tickets available`
                                }
                            </p>

                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                onClick={() =>
                                    setQuantity(
                                        Math.max(1, quantity - 1)
                                    )
                                }
                                className="w-12 h-12 rounded-xl border text-xl font-bold hover:bg-gray-100"
                            >
                                -
                            </button>

                            <div className="flex-1 text-center border rounded-xl py-3 font-bold text-lg">
                                {quantity}
                            </div>

                            <button
                                onClick={() => {

                                    if (
                                        quantity < remainingTickets
                                    ) {
                                        setQuantity(
                                            quantity + 1
                                        );
                                    }

                                }}
                                disabled={
                                    quantity >= remainingTickets
                                }
                                className="w-12 h-12 rounded-xl border text-xl font-bold hover:bg-gray-100 disabled:opacity-40"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button onClick={handleRegister} disabled={isSoldOut} className="w-full bg-purple-600 text-white rounded-xl py-4 font-bold disabled:opacity-50">
                        {
                            isSoldOut
                                ? "Sold Out"
                                : "Register Now"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;