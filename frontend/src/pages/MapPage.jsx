import { useState } from "react";
import MapSidebar from "../components/MapSidebar";
import MapView from "../components/MapView";
import { events } from "../data/events";

const MapPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="h-[calc(100vh-80px)] flex">

      <MapSidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        events={events}
      />

      <div className="flex-1">
        <MapView events={filteredEvents} />
      </div>

    </div>
  );
};

export default MapPage;