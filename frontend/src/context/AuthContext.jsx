import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const [tickets, setTickets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tickets") || "[]");
    } catch {
      return [];
    }
  });

  // LOAD USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // SIGNUP
  const signup = async (name, email, password, role) => {
    try {
      const data = await registerUser({ name, email, password, role });
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Signup failed",
      };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  // LOGOUT — also clear tickets
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tickets"); 
    setUser(null);
    setTickets([]);
  };

  
  const registerTicket = (ticket) => {
    const updated = [...tickets, ticket];
    setTickets(updated);
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  return (
    
    <AuthContext.Provider value={{ user, loading, signup, login, logout, tickets, registerTicket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);