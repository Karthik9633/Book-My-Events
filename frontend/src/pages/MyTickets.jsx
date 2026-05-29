import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { fetchMyTickets } from "../api/eventApi";
import { useState, useEffect } from "react";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTickets().then(({
            data
        }) => {
            if (data.success) {
                setTickets(data.tickets);
            }
        }).catch(console.log).finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (<div className="p-10 text-center">Loading tickets...</div>);
    }


    return (

        <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
                <p className="text-gray-500 mb-10">
                    Manage your upcoming experiences and past memories.
                </p>

                {/* TABS */}
                <div className="flex gap-8 border-b mb-10">
                    <button className="text-purple-600 border-b-2 border-purple-600 pb-3 font-semibold">
                        Upcoming ({tickets.length})
                    </button>
                </div>

                {tickets.length === 0 ? (
                    <p className="text-gray-500">No tickets registered yet.</p>
                ) : (
                    <div className="space-y-8">
                        {tickets.filter(
                            (ticket) => ticket.event?._id
                        )
                            .map((ticket) => (
                                <div
                                    key={ticket._id}
                                    className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row"
                                >
                                    {/* IMAGE */}
                                    <div className="md:w-1/3 relative">
                                        <img
                                            src={ticket.image || "https://picsum.photos/400/300"}
                                            alt={ticket.eventTitle}
                                            className="h-64 md:h-full w-full object-cover"
                                        />
                                        <span className="absolute top-4 left-4 bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1 rounded-full">
                                            CONFIRMED
                                        </span>
                                    </div>

                                    {/* DETAILS */}
                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold">
                                                    {ticket.eventTitle}
                                                </h3>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    🎟 {ticket.quantity} {ticket.quantity > 1 ? "Tickets" : "Ticket"}
                                                </span>
                                            </div>

                                            <div className="text-gray-500 text-sm space-y-2">
                                                <p className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {ticket.date}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <MapPin size={16} />
                                                    {ticket.location}
                                                </p>
                                            </div>
                                        </div>

                                        {/* VIEW TICKET BUTTON */}
                                        <div className="flex justify-end mt-6">
                                            <Link
                                                to={`/success/${ticket.event?._id}`}
                                                state={{
                                                    tier: ticket.tier,
                                                    quantity: ticket.quantity,
                                                    total: ticket.total,
                                                }}
                                                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                                            >
                                                <Ticket size={16} />
                                                View Ticket
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* SUPPORT SECTION */}
                <div className="mt-20 bg-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="font-semibold text-lg">Need help with your booking?</h3>
                        <p className="text-gray-500 text-sm">Our support team is available 24/7 to assist you.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 rounded-full border font-medium">View FAQs</button>
                        <button className="px-6 py-3 rounded-full bg-black text-white font-medium">Contact Support</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyTickets;