import { Link } from "react-router-dom";
const FeaturedExperience = ({ event }) => {
  if (!event) return null;

  return (
    <div className="max-w-7xl mx-auto px-10 mt-16 mb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Featured Experience</h2>
        <Link to="/search" className="text-purple-600 font-semibold hover:underline">
          See top picks →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300">

        <div className="relative">
          <img
            src={event.image || event.images?.[0] || "https://picsum.photos/800/500"}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          <span className="absolute top-6 left-6 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
            FEATURED TODAY
          </span>
        </div>


        <div className="p-12 flex flex-col justify-center">

          <span className="text-purple-600 font-semibold text-sm mb-4 uppercase tracking-wide">
            {
              event.category?.name || event.category || "Uncategorized"
            }
          </span>

          <h3 className="text-3xl font-bold mb-6 leading-tight">
            {event.title}
          </h3>

          <p className="text-gray-600 mb-6">
            {event.description}
          </p>

          <div className="text-gray-500 mb-8 space-y-1">
            <p>📅 {
              new Date(event.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })
            }</p>
            <p>📍 {event.venueAddress || event.location ? `${event.location.address},${event.location.city}` : "Location TBA"}</p>
          </div>

          <Link to={`/event/${String(event._id || event.id).trim()}`} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold w-fit hover:opacity-90 transition">
            Reserve Your Spot →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FeaturedExperience;