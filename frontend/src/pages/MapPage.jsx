import { useEffect, useState } from "react";
import MapSidebar from "../components/MapSidebar";
import MapView from "../components/MapView";
import { fetchEvents } from "../api/eventApi";

const MapPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await fetchEvents();
        if (data.success) setEvents(data.events);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents =
    selectedCategory === "All Events"
      ? events
      : events.filter((event) => {
        const cat = event.category?.name || event.category || "";
        return cat.toLowerCase() === selectedCategory.toLowerCase();
      });

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading events on map...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row relative overflow-hidden">

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-30">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Showing</p>
          <p className="text-sm font-bold text-gray-800">{filteredEvents.length} events nearby</p>
        </div>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-purple-200 active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" />
          </svg>
          Event List
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
          <div className="relative z-10 w-full max-w-sm h-full bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-5 py-4 border-b bg-white sticky top-0 z-10">
              <h2 className="font-bold text-lg text-gray-900">Events Nearby</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MapSidebar
                events={events}
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => {
                  setSelectedCategory(cat);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[440px] h-full flex-col">
        <MapSidebar
          events={events}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView events={filteredEvents} />

        {/* Floating event count badge on desktop */}
        <div className="hidden lg:flex absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-2.5 items-center gap-2 border border-gray-100">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-sm font-semibold text-gray-700">{filteredEvents.length} events on map</span>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-left { animation: slide-in-left 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default MapPage;