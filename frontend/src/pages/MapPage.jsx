import { useEffect, useState } from "react";
import MapSidebar from "../components/MapSidebar";
import MapView from "../components/MapView";
import { fetchEvents } from "../api/eventApi";

const MapPage = () => {

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  useEffect(() => {

    const loadEvents = async () => {

      try {

        const { data } =
          await fetchEvents();

        if (data.success) {

          setEvents(data.events);

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    loadEvents();

  }, []);

  const filteredEvents =
    selectedCategory === "ALL"
      ? events
      : events.filter(
        (event) =>
          (
            event.category?.name ||
            event.category
          )
            .toUpperCase()
            .replace("&", "&")
          === selectedCategory
      );

  if (loading) {

    return (
      <div className="h-screen flex items-center justify-center">
        Loading events...
      </div>
    );

  }

  return (

    <div className="h-[calc(100vh-80px)] flex">

      <MapSidebar
        events={events}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="flex-1">

        <MapView
          events={filteredEvents}
        />

      </div>

    </div>

  );

};

export default MapPage;