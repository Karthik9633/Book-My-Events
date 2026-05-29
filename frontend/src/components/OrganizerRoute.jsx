import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OrganizerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Still hydrating from localStorage — render nothing yet
  if (loading) return null;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not an organizer / admin
  if (user.role !== "organizer" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OrganizerRoute;