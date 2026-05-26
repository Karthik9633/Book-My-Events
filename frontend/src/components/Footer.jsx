import 'primeicons/primeicons.css';
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

const Footer = () => {

  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = () => {
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showToast("Enter a valid email address", "error");
      return;
    }

    showToast("Subscribed successfully 🎉", "success");
    setEmail("");
  };

  return (
    <footer className="bg-gray-50 border-t mt-0">
      <div className="max-w-7xl mx-auto px-10 py-16 grid md:grid-cols-4 gap-12">

        {/* LOGO + SOCIAL */}
        <div>
          <h2
            onClick={() => { navigate("/"); scrollTop(); }}
            className="text-2xl font-extrabold text-primary mb-4 cursor-pointer"
          >
            BookMyEvent
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Discover unforgettable experiences near you. From music festivals
            to tech summits, find events that match your passion.
          </p>

          <div className="flex gap-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="pi pi-facebook" style={{ color: 'slateblue' }}></i>
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <i className="pi pi-google" style={{ color: 'slateblue' }}></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="pi pi-instagram" style={{ color: 'slateblue' }}></i>
            </a>
            <a href="https://wa.me" target="_blank" rel="noreferrer">
              <i className="pi pi-whatsapp" style={{ color: 'slateblue' }}></i>
            </a>
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <h4 className="font-bold mb-4">Explore</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li>
              <NavLink to="/search" onClick={scrollTop} className="hover:text-primary">
                All Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/search?q=music" onClick={scrollTop} className="hover:text-primary">
                Music
              </NavLink>
            </li>
            <li>
              <NavLink to="/search?q=technology" onClick={scrollTop} className="hover:text-primary">
                Technology
              </NavLink>
            </li>
            <li>
              <NavLink to="/search?q=sports" onClick={scrollTop} className="hover:text-primary">
                Sports
              </NavLink>
            </li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li>
              <NavLink to="/about" onClick={scrollTop} className="hover:text-primary">
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={scrollTop} className="hover:text-primary">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h4 className="font-bold mb-4">Stay Updated</h4>
          <p className="text-gray-500 text-sm mb-4">
            Get event updates straight to your inbox.
          </p>

          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-lg border outline-none text-sm"
            />
            <button
              onClick={handleSubscribe}
              className="bg-primary text-white px-4 py-2 rounded-r-lg text-sm font-semibold hover:opacity-90 transition"
            >
              Join
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t py-6">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">

          <p>© {new Date().getFullYear()} BookMyEvent. All rights reserved.</p>

          <div className="flex gap-6">
            <NavLink to="/privacy" onClick={scrollTop} className="hover:text-primary">
              Privacy Policy
            </NavLink>
            <NavLink to="/terms" onClick={scrollTop} className="hover:text-primary">
              Terms of Service
            </NavLink>
            <NavLink to="/cookies" onClick={scrollTop} className="hover:text-primary">
              Cookies
            </NavLink>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;