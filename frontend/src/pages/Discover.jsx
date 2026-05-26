import { events } from "../data/events";
import EventCard from "../components/EventCard";

const Discover = () => {
  return (
    <div className="max-w-7xl mx-auto p-10">
      <h2 className="text-3xl font-bold mb-8">Browse Events</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Discover;