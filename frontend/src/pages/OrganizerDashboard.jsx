// OrganizerDashboard.jsx — full replacement
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OrganizerDashboard = () => {
  const { user, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Redirect non-organizers away
  if (!user || (user.role !== "organizer" && user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Organizer Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/create-event"
          className="bg-purple-600 text-white p-6 rounded-2xl font-bold text-xl"
        >
          Create Event
        </Link>

        <Link
          to="/my-events"
          className="bg-blue-600 text-white p-6 rounded-2xl font-bold text-xl"
        >
          My Events
        </Link>

        <Link
          to="/analytics"
          className="bg-green-600 text-white p-6 rounded-2xl font-bold text-xl"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
};

export default OrganizerDashboard;