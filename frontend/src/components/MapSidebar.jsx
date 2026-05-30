import { useMemo, useState } from "react";
import { Heart, MapPin, Calendar, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  "All Events", "Music", "Technology", "Business", "Health", "Art", "Food",
];

const categoryEmoji = {
  "All Events": "✦",
  "Music": "🎵",
  "Technology": "💡",
  "Business": "💼",
  "Health": "🌿",
  "Art": "🎨",
  "Food": "🍽️",
};

const MapSidebar = ({ events, selectedCategory, setSelectedCategory }) => {
  const [sortOption, setSortOption] = useState("DEFAULT");
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const categoryFiltered =
    selectedCategory === "All Events"
      ? events
      : events.filter((event) => {
          const cat = event.category?.name || event.category || "";
          return cat.toLowerCase() === selectedCategory.toLowerCase();
        });

  const filteredEvents = useMemo(() => {
    let sorted = [...categoryFiltered];
    if (sortOption === "LOW_HIGH") sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortOption === "HIGH_LOW") sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortOption === "NEWEST") sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
  }, [categoryFiltered, sortOption]);

  return (
    <aside className="w-full h-full bg-white flex flex-col border-r border-gray-100">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Discover</p>
            <h2 className="text-xl font-bold text-gray-900">
              {filteredEvents.length}
              <span className="text-gray-400 font-normal text-base ml-1">events nearby</span>
            </h2>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-purple-50 text-purple-700 text-xs font-semibold pl-3 pr-7 py-2 rounded-xl border border-purple-100 outline-none cursor-pointer hover:bg-purple-100 transition"
            >
              <option value="DEFAULT">Sort</option>
              <option value="LOW_HIGH">Price ↑</option>
              <option value="HIGH_LOW">Price ↓</option>
              <option value="NEWEST">Newest</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0
                ${selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span>{categoryEmoji[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">🗺️</div>
            <p className="text-gray-500 text-sm font-medium">No events in this category</p>
            <button
              onClick={() => setSelectedCategory("All Events")}
              className="text-purple-600 text-xs font-semibold hover:underline"
            >
              Show all events
            </button>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={event.images?.[0] || `https://picsum.photos/seed/${event._id}/400/200`}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(event._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition hover:scale-110 active:scale-95"
                >
                  <Heart
                    size={15}
                    className={favorites.has(event._id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>

                {/* Free badge */}
                {event.price === 0 && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                    FREE
                  </span>
                )}

                {/* Category badge */}
                {(event.category?.name || event.category) && (
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {event.category?.name || event.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
                    {event.title}
                  </h3>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-purple-600 text-base leading-none">
                      {event.price === 0 ? "Free" : `₹${event.price}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">per ticket</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={11} className="text-purple-400 shrink-0" />
                    <span className="truncate">{event.location?.city}, {event.location?.state}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-600 font-medium">
                    <Calendar size={11} className="shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                <Link to={`/event/${event._id}`}>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default MapSidebar;