import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Wait for auth to load before deciding
    if (loading) return <div className="p-10 text-center">Loading...</div>;

    // ✅ Redirect non-admins away
    if (!user || user.role !== "admin") {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const links = [
        { to: "/admin", label: "📊 Dashboard" },
        { to: "/admin/users", label: "👥 Users" },
        { to: "/admin/events", label: "📅 Events" },
        { to: "/admin/bookings", label: "🎟️ Bookings" },
        { to: "/admin/analytics", label: "📈 Analytics" },
        { to: "/admin/newsletter", label: "📧 Newsletter" },
    ];

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
                <p className="text-gray-400 text-sm mb-8">👤 {user.name}</p>

                <nav className="space-y-2 flex-1">
                    {links.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <Link
                    to="/"
                    className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-center mt-4"
                >
                    ← Back to Site
                </Link>
            </aside>

            <main className="flex-1 bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;