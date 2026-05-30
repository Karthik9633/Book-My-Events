import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import { fetchEvents, fetchTrendingEvents } from "../api/eventApi";
import EventCard from "../components/EventCard";
import FeaturedExperience from "../components/FeaturedExperience";
import Newsletter from "../components/Newsletter";
import { Link } from "react-router-dom";
import UpcomingSection from "../components/UpcomingSection";

const categories = [
  "All Events",
  "Music",
  "Technology",
  "Business",
  "Health",
  "Art",
  "Food",
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchEvents();
        if (data.success) setEvents(data.events);

        const trendingRes = await fetchTrendingEvents();
        if (trendingRes.data.success) setTrending(trendingRes.data.events);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    selectedCategory === "All Events"
      ? events
      : events.filter((event) => {
        const category = event.category?.name || event.category || "";
        return category.toLowerCase().includes(selectedCategory.toLowerCase());
      });

  const featuredEvent = filtered[0] || null;

  return (
    <>
      <Hero />

      {/* Category Filter Bar */}
      <div className="bg-gray-50 border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex gap-3 overflow-x-auto scrollbar-hide lg:justify-center">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0
                ${selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Experience */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        featuredEvent && (
          <FeaturedExperience
            event={{
              ...featuredEvent,
              image: featuredEvent.images?.[0],
              venueAddress: featuredEvent.location
                ? `${featuredEvent.location.address}, ${featuredEvent.location.city}`
                : "",
            }}
          />
        )
      )}

      {/* Trending Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-20">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">🔥 Trending Events</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((event) => (
            <EventCard
              key={event._id}
              event={{ ...event, id: event._id }}
            />
          ))}
        </div>
      </div>

      <UpcomingSection />
      <Newsletter />
    </>
  );
};

export default Home;