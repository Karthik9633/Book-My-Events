import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/adminApi";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllBookings()
            .then(({ data }) => { if (data.success) setBookings(data.bookings); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = bookings.filter((b) => {
        const q = search.toLowerCase();
        return (
            b.user?.name?.toLowerCase().includes(q) ||
            b.user?.email?.toLowerCase().includes(q) ||
            b.event?.title?.toLowerCase().includes(q)
        );
    });

    if (loading) return <div className="p-8">Loading Bookings...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Bookings</h1>

            <input
                type="text"
                placeholder="Search by user or event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-xl px-4 py-2 mb-6 w-80"
            />

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Event</th>
                            <th className="p-4 text-left">Qty</th>
                            <th className="p-4 text-left">Total</th>
                            <th className="p-4 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-400">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                        {filtered.map((b) => (
                            <tr key={b._id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{b.user?.name || "—"}</td>
                                <td className="p-4">{b.user?.email || "—"}</td>
                                <td className="p-4">{b.event?.title || "—"}</td>
                                <td className="p-4">{b.quantity}</td>
                                <td className="p-4 font-medium text-purple-700">₹{b.total}</td>
                                <td className="p-4 text-gray-500">
                                    {new Date(b.createdAt).toLocaleDateString("en-IN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;