import { useAuth } from "../context/AuthContext";

const UserOnlyRoute = ({ children }) => {

  const { loading } = useAuth();

  if (loading) return null;

  return children;

};

export default UserOnlyRoute;