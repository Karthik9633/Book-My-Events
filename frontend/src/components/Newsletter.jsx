import { useState } from "react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      showToast("Please enter a valid Gmail address ❌", "error");
      return;
    }

    try {
      setLoading(true);
      showToast("Sending subscription request... ⏳", "info");

      await API.post("/newsletter/subscribe", { email });

      showToast("🎉 Successfully subscribed! Check your Gmail.", "success");
      setEmail("");
    } catch (error) {
      showToast("❌ Failed to subscribe. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary mt-20 py-20">
      <div className="max-w-4xl mx-auto text-center px-6">

        <h2 className="text-4xl font-extrabold text-white mb-4">
          Stay in the Loop
        </h2>

        <p className="text-white/80 mb-8 text-lg">
          Get weekly updates on the best events happening near you.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your Gmail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-xl outline-none text-gray-800"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:opacity-90 transition whitespace-nowrap disabled:opacity-60"
          >
            {loading ? "Sending..." : "Subscribe →"}
          </button>
        </form>

        <p className="text-white/60 text-sm mt-6">
          We respect your privacy. Unsubscribe anytime.
        </p>

      </div>
    </div>
  );
};

export default Newsletter;