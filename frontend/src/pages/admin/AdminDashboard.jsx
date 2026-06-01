import { useEffect, useState } from "react";
import { Users, CalendarDays, Shield, Activity, Ticket } from "lucide-react";
import { getDashboardStats } from "../../api/adminApi";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(({ data }) => { if (data.success) setStats(data.stats); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { title: "Total Users", value: stats?.totalUsers ?? "—", icon: Users },
        { title: "Total Events", value: stats?.totalEvents ?? "—", icon: CalendarDays },
        { title: "Organizers", value: stats?.totalOrganizers ?? "—", icon: Shield },
        { title: "Active Events", value: stats?.activeEvents ?? "—", icon: Activity },
        { title: "Total Bookings", value: stats?.totalBookings ?? "—", icon: Ticket },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {loading ? (
                <p className="text-gray-500">Loading stats...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {cards.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className="bg-white rounded-2xl p-6 shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-500 text-sm">{item.title}</p>
                                        <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
                                    </div>
                                    <Icon size={32} className="text-purple-600" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;