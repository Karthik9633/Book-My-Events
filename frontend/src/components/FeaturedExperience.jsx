import { Link } from "react-router-dom";

const FeaturedExperience = ({ event }) => {
  if (!event) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 mb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold">Featured Experience</h2>
        <Link to="/search" className="text-purple-600 font-semibold hover:underline text-sm sm:text-base">
          See top picks →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300">

        {/* Image */}
        <div className="relative h-64 sm:h-80 md:h-auto">
          <img
            src={event.image || event.images?.[0] || "https://picsum.photos/800/500"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
            FEATURED TODAY
          </span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
          <span className="text-purple-600 font-semibold text-xs sm:text-sm mb-3 uppercase tracking-wide">
            {event.category?.name || event.category || "Uncategorized"}
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm sm:text-base mb-5 line-clamp-3">
            {event.description}
          </p>

          <div className="text-gray-500 text-sm sm:text-base mb-7 space-y-1.5">
            <p>
              📅{" "}
              {new Date(event.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p>
              📍{" "}
              {event.venueAddress ||
                (event.location
                  ? `${event.location.address}, ${event.location.city}`
                  : "Location TBA")}
            </p>
          </div>

          <Link
            to={`/event/${String(event._id || event.id).trim()}`}
            className="bg-purple-600 text-white px-7 py-3 rounded-xl font-semibold w-fit hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition-all duration-200 text-sm sm:text-base"
          >
            Reserve Your Spot →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FeaturedExperience;