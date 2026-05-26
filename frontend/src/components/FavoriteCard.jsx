import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import 'primeicons/primeicons.css';

const FavoriteCard = ({ event }) => {
  const { removeFavorite } = useFavorites();

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">

      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />

        <span className="absolute bottom-3 left-3 bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full font-semibold">
          {event.category}
        </span>

        <button
          onClick={() => removeFavorite(event.id)}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <i className="pi pi-heart-fill text-red-500"></i>
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500">
          {event.date}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          {event.location}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Tickets from</p>
            <p className="font-bold text-lg">
              ${event.price}
            </p>
          </div>

          <Link
            to={`/event/${event.id}`}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;