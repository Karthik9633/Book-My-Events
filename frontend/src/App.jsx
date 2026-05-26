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
import MyEvents from "./pages/MyEvents";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderSummary from "./pages/OrderSummary"

function App() {

  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (

    <div className="min-h-screen bg-white">

      {!hideLayout && <Navbar />}

      <main
        className={
          !hideLayout
            ? "pt-[88px]"
            : ""
        }
      >

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/calendar" element={<CalendarPage />} />

          <Route path="/map" element={<MapPage />} />

          <Route path="/search" element={<SearchResults />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/favorites" element={
            <ProtectedRoute>
              <MyFavorites />
            </ProtectedRoute>
          }
          />

          <Route
            path="/success/:id"
            element={<RegistrationSuccess />}
          />

          <Route
            path="/mytickets"
            element={<MyTickets />}
          />

          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />
          <Route
            path="/organizer"
            element={
              <ProtectedRoute>

                <OrganizerDashboard />

              </ProtectedRoute>
            }
          />

          <Route
            path="/create-event"
            element={
              <ProtectedRoute>

                <CreateEvent />

              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-event/:id"
            element={
              <ProtectedRoute>

                <CreateEvent />

              </ProtectedRoute>
            }
          />

          <Route

            path="/my-events"

            element={

              <ProtectedRoute>

                <MyEvents />

              </ProtectedRoute>

            }

          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />

          <Route
            path="/reset-password"
            element={
              <ResetPassword />
            }
          />

          <Route path="/order-summary" element={<OrderSummary />} />

        </Routes>

      </main>

      {!hideLayout && <Footer />}

    </div>
  );
}

export default App;