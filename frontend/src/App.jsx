import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import EventDetails from "./pages/EventDetails";
import CalendarPage from "./pages/CalendarPage";
import MapPage from "./pages/MapPage";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyFavorites from "./pages/MyFavorites";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import MyTickets from "./pages/MyTickets";
import About from "./pages/About";
import VerifyOTP from "./pages/VerifyOTP";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizerRoute from "./components/OrganizerRoute";
import UserOnlyRoute from "./components/UserOnlyRoute";
import MyEvents from "./pages/MyEvents";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderSummary from "./pages/OrderSummary";
import Analytics from "./pages/Analytics";

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-white">

      {!hideLayout && <Navbar />}

      <main className={!hideLayout ? "pt-[88px]" : ""}>
        <Routes>

          //Public routes
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          //all users and visitors
          <Route path="/about" element={<About />} />

          //User only routes
          <Route path="/" element={<UserOnlyRoute><Home /></UserOnlyRoute>} />
          <Route path="/discover" element={<UserOnlyRoute><Discover /></UserOnlyRoute>} />
          <Route path="/event/:id" element={<UserOnlyRoute><EventDetails /></UserOnlyRoute>} />
          <Route path="/calendar" element={<UserOnlyRoute><CalendarPage /></UserOnlyRoute>} />
          <Route path="/map" element={<UserOnlyRoute><MapPage /></UserOnlyRoute>} />
          <Route path="/search" element={<UserOnlyRoute><SearchResults /></UserOnlyRoute>} />
          <Route path="/success/:id" element={<UserOnlyRoute><RegistrationSuccess /></UserOnlyRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><UserOnlyRoute><MyFavorites /></UserOnlyRoute></ProtectedRoute>} />
          <Route path="/mytickets" element={<ProtectedRoute><UserOnlyRoute><MyTickets /></UserOnlyRoute></ProtectedRoute>} />
          <Route path="/order-summary" element={<ProtectedRoute><UserOnlyRoute><OrderSummary /></UserOnlyRoute></ProtectedRoute>} />

          //organizer/admin routes
          <Route path="/organizer" element={<OrganizerRoute><OrganizerDashboard /></OrganizerRoute>} />
          <Route path="/create-event" element={<OrganizerRoute><CreateEvent /></OrganizerRoute>} />
          <Route path="/edit-event/:id" element={<OrganizerRoute><CreateEvent /></OrganizerRoute>} />
          <Route path="/my-events" element={<OrganizerRoute><MyEvents /></OrganizerRoute>} />
          <Route path="/analytics" element={<OrganizerRoute><Analytics /></OrganizerRoute>} />

        </Routes>
      </main>

      {!hideLayout && <Footer />}

    </div>
  );
}

export default App;