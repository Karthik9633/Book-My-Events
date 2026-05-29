import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Organizer / admin → send to their dashboard
  if (user?.role === "organizer" || user?.role === "admin") {
    return <Navigate to="/organizer" replace />;
  }

  return children;
};

export default UserOnlyRoute;