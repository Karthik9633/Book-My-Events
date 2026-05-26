import { CheckCircle, Download, Eye, Share2, Mail } from "lucide-react";
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

    useEffect(() => {
        fetchEvent(id)
            .then(({ data }) => { if (data.success) setEvent(data.event); })
            .catch(console.error)
            .finally(() => setEventLoading(false));
    }, [id]);

    if (eventLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

    const selectedTier = location.state?.tier;
    const quantity = location.state?.quantity || 1;
    const totalPrice = location.state?.total || 0;

    const image = event.images?.[0] || "https://picsum.photos/800/500";  

    const venue = event.location                                          
        ? `${event.location.address}, ${event.location.city}, ${event.location.state}`
        : "Venue TBD";

    const date = new Date(event.date).toLocaleDateString("en-IN", {      
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const qrValue = `Event: ${event.title}\nTicket: ${selectedTier?.name || "General Admission"}\nQuantity: ${quantity}\nUser: ${user?.name || "Guest"}\nOrder: EV-${event._id}`; 

    return (
        <div className="bg-gray-50 min-h-screen pt-28 pb-20">

            {/* SUCCESS HEADER */}
            <div className="text-center mb-14 px-6">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Registration Successful!</h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Your booking is confirmed. We've sent a copy of your ticket and receipt to your email address.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 px-6">

                {/* LEFT TICKET */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-md overflow-hidden flex">

                    {/* IMAGE */}
                    <div className="w-1/2 relative">
                        <img
                            src={image}                          
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-6 left-6 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Venue <br />
                            {venue}                             
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="w-1/2 p-8 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-bold text-purple-600 tracking-wide mb-2">
                                OFFICIAL ENTRY PASS
                            </p>
                            <h2 className="text-2xl font-bold mb-6">{event.title}</h2>

                            <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                                <div>
                                    <p className="font-semibold text-gray-800">Attendee</p>
                                    <p>{user?.name || "Guest User"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Date & Time</p>
                                    <p>{date}</p>                
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Ticket Type</p>
                                    <p>{selectedTier?.name || "General Admission"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Order #</p>
                                    <p>EV-{event._id}</p>      
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <QRCodeCanvas
                                value={qrValue}
                                size={120}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>

                        <p className="text-xs text-gray-400 mt-4 text-center">
                            Please present this QR code at the main entrance for check-in.
                        </p>
                    </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-md p-8">
                        <h3 className="text-lg font-bold mb-6">Order Summary</h3>

                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Ticket Type</span>
                                <span className="font-medium text-gray-800">
                                    {selectedTier?.name || "General Admission"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Quantity</span>
                                <span className="font-medium text-gray-800">{quantity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Price per ticket</span>
                                <span className="font-medium text-gray-800">
                                    ₹{selectedTier?.price ?? 0}
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Charged</span>
                                <span className="text-purple-600">₹{totalPrice}</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-purple-50 p-4 rounded-xl text-sm text-purple-700 flex gap-3">
                            <Mail size={18} />
                            <p>
                                A copy of your ticket and receipt has been sent to:<br />
                                <span className="font-semibold">{user?.email || "your@email.com"}</span>
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/mytickets"
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-4 rounded-full font-semibold shadow-lg hover:opacity-95 transition"
                    >
                        <Eye size={18} />
                        View My Events
                    </Link>

                    <button className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-4 rounded-full font-semibold hover:bg-gray-300 transition">
                        <Download size={18} />
                        Download PDF
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-purple-600 transition">
                        <Share2 size={18} />
                        Share with Friends
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccess;