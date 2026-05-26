import { useState, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import FavoritesSidebar from "../components/FavoritesSidebar";
import FavoriteCard from "../components/FavoriteCard";
import Pagination from "../components/Pagination";
import { fetchFavorites } from "../api/eventApi";
import { useFavorites } from "../context/FavoritesContext";

const EVENTS_PER_PAGE = 6;

const MyFavorites = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const { favoriteIds } = useFavorites(); // used to re-fetch when a heart is toggled
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Re-fetch from backend whenever favoriteIds changes (toggle adds/removes)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const {
          data
        } = await fetchFavorites();
        if (data.success) {
          setEvents(data.events || []);
        }
      } catch (err) {
        setEvents([]);
        setError(err.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [favoriteIds]);

  // Normalize backend event → shape FavoriteCard expects
  const normalize = (ev) => ({
    id: ev._id,
    title: ev.title,
    category: ev.category?.name ?? ev.category ?? "",
    date: ev.date
      ? new Date(ev.date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "",
    location: ev.location ? `${ev.location.city}, ${ev.location.state}` : "",
    price: ev.price ?? 0,
    priceType: ev.priceType ?? "free",
    image: ev.images?.[0] ?? `https://picsum.photos/seed/${ev._id}/640/360`,
  });

  const normalized = events.map(normalize);
  const totalPages = Math.ceil(normalized.length / EVENTS_PER_PAGE);
  const paginated = normalized.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <FavoritesSidebar />

      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Your Favorite Events{" "}
              {!loading && (
                <span className="text-purple-600">({normalized.length})</span>
              )}
            </h1>
            <p className="text-gray-500 mt-2">
              Manage and track the events you're interested in attending.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setView("grid")}
              className={`p-3 rounded-xl shadow transition ${view === "grid" ? "bg-purple-600 text-white" : "bg-white"
                }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-3 rounded-xl shadow transition ${view === "list" ? "bg-purple-600 text-white" : "bg-white"
                }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && normalized.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
            <span className="text-5xl">♡</span>
            <p className="font-medium text-gray-600">No favorite events yet.</p>
            <p className="text-sm">Tap the heart on any event to save it here.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && paginated.length > 0 && (
          <div
            className={
              view === "grid"
                ? "grid md:grid-cols-2 xl:grid-cols-3 gap-8"
                : "flex flex-col gap-4"
            }
          >
            {paginated.map((event) => (
              <FavoriteCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default MyFavorites;