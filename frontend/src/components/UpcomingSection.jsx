import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchEvents } from "../api/eventApi";
import EventCard, { normalizeEvent } from "./EventCard";

const ITEMS_PER_PAGE = 4;

const UpcomingSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    searchEvents({ sort: "date-asc", limit: 12, page: 1 })
      .then(({ data }) => {
        if (data.success) setEvents(data.events.map(normalizeEvent));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visible = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + ITEMS_PER_PAGE >= events.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <p className="text-gray-500 text-sm">Handpicked events happening soon</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setStartIndex((p) => Math.max(0, p - ITEMS_PER_PAGE))}
            disabled={isPrevDisabled}
            className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-sm transition text-xl ${
              isPrevDisabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
          >
            ‹
          </button>
          <button
            onClick={() => setStartIndex((p) => p + ITEMS_PER_PAGE)}
            disabled={isNextDisabled}
            className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-sm transition text-xl ${
              isNextDisabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
          >
            ›
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No upcoming events yet. Be the first to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visible.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <Link
          to="/search"
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
        >
          Browse All Events →
        </Link>
      </div>
    </div>
  );
};

export default UpcomingSection;