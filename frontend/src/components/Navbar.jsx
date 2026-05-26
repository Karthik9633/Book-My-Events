import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full h-[88px] bg-white shadow-md z-50">

      {/* TOP NAV */}
      <div className="h-full px-4 sm:px-6 lg:px-10 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-purple-600">
          BookMyEvent
        </h1>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex space-x-8 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                : "hover:text-purple-600 transition"
            }
          >
            Discover
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                : "hover:text-purple-600 transition"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                : "hover:text-purple-600 transition"
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                : "hover:text-purple-600 transition"
            }
          >
            Map
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                : "hover:text-purple-600 transition"
            }
          >
            My Favorites
          </NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex gap-3 relative">
          {user ? (
            <>
              {/* PROFILE CIRCLE */}
              <div
                onClick={() => setDropdown(!dropdown)}
                className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center cursor-pointer font-bold"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* DROPDOWN */}
              {dropdown && (
                <div className="absolute right-0 top-14 bg-white shadow-lg rounded-xl w-40 py-2">
                  <button
                    onClick={() => {
                      navigate("/mytickets");
                      setDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Tickets
                  </button>

                  {(user.role === "organizer" || user.role === "admin") && (
                    <button
                      onClick={() => {
                        navigate("/organizer");
                        setDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-purple-600 font-semibold"
                    >
                      Organizer Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* HAMBURGER BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-6 flex flex-col gap-4 bg-white shadow-lg">

          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="font-medium"
          >
            Discover
          </NavLink>

          <NavLink
            to="/search"
            onClick={() => setIsOpen(false)}
            className="font-medium"
          >
            Events
          </NavLink>

          <NavLink
            to="/map"
            onClick={() => setIsOpen(false)}
            className="font-medium"
          >
            Map
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={() => setIsOpen(false)}
            className="font-medium"
          >
            My Favorites
          </NavLink>

          {user ? (
            <>
              <button
                onClick={() => {
                  navigate("/mytickets");
                  setIsOpen(false);
                }}
                className="text-left font-medium"
              >
                My Tickets
              </button>

              {(user.role === "organizer" || user.role === "admin") && (
                <button
                  onClick={() => {
                    navigate("/organizer");
                    setIsOpen(false);
                  }}
                  className="text-left font-semibold text-purple-600"
                >
                  Organizer Dashboard
                </button>
              )}


              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setIsOpen(false);
                }}
                className="text-left text-red-500 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="bg-purple-600 text-white px-4 py-2 rounded-full text-center"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="bg-purple-600 text-white px-4 py-2 rounded-full text-center"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      </div>

    </nav>
  );
};

export default Navbar;