import "primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

export const normalizeEvent = (ev) => ({
  id: ev._id,
  title: ev.title,
  description: ev.description,
  category: ev.category?.name ?? ev.category ?? "Uncategorized",
  date: ev.date
    ? new Date(ev.date).toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    })
    : "",
  startTime: ev.startTime,
  location: ev.location ? `${ev.location.city}, ${ev.location.state}` : "",
  address: ev.location?.address ?? "",
  lat: ev.location?.geo?.lat,
  lng: ev.location?.geo?.lng,
  price: ev.price ?? 0,
  priceType: ev.priceType ?? "free",
  image: ev.images?.[0] ?? `https://picsum.photos/seed/${ev._id}/640/360`,
  organizer: ev.organizer?.name ?? "Unknown",
  tags: ev.tags ?? [],
  bookmarks: ev.bookmarks ?? 0,
  views: ev.views ?? 0,
});

const EventCard = ({ event: rawEvent, layout = "grid" }) => {
  const event = rawEvent._id !== undefined ? normalizeEvent(rawEvent) : rawEvent;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth(); // ✅ check if logged in
  const navigate = useNavigate();
  const saved = isFavorite(event.id);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ✅ Redirect to login if not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await toggleFavorite(event.id);
    } catch (error) {
      console.log(error);
    }
  };

  if (layout === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition flex gap-0">
        <div className="relative w-48 shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <span className="absolute top-3 left-3 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold">
            {event.category}
          </span>
        </div>
        <div className="flex flex-col justify-between p-5 flex-1">
          <div>
            <h3 className="font-bold text-lg mb-1 line-clamp-1">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.date} · {event.startTime}</p>
            <p className="text-sm text-gray-500 mb-2">{event.location}</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">Tickets from</p>
              <p className="font-bold text-lg">
                {event.priceType === "free" ? "Free" : `₹${event.price}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFavorite}
                className="bg-gray-100 p-2 rounded-full hover:bg-red-50 transition"
                title={user ? "Save event" : "Login to save"}
              >
                {/* ✅ Show red heart only if logged in AND saved */}
                {user && saved
                  ? <span className="text-red-500">♥</span>
                  : <span className="text-gray-500">♡</span>}
              </button>
              <Link
                to={`/event/${event.id}`}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        <span className="absolute bottom-3 left-3 bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
          {event.category}
        </span>
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
          title={user ? "Save event" : "Login to save"}
        >
          {/* ✅ Show red heart only if logged in AND saved */}
          {user && saved
            ? <span className="text-red-500 text-lg">♥</span>
            : <span className="text-gray-600 text-lg">♡</span>}
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.date}</p>
        <p className="text-sm text-gray-500 mb-4">{event.location}</p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Tickets from</p>
            <p className="font-bold text-lg">
              {event.priceType === "free" ? "Free" : `₹${event.price}`}
            </p>
          </div>
          <Link
            to={`/event/${event.id}`}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;