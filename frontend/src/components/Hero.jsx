import { Search, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchEvents } from "../api/eventApi";

const Hero = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const load = async () => {
            try {
                const { data } = await searchEvents({ search: query, limit: 5 });
                if (data.success) setSuggestions(data.events);
            } catch (err) {
                console.log(err);
            }
        };

        const timer = setTimeout(load, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = () => {
        navigate(
            `/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}`
        );
    };

    return (
        <div className="relative bg-black">
            <div
                className="min-h-[600px] bg-cover bg-center relative flex items-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2')",
                }}
            >
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center text-white">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                        Discover experiences <br />
                        that{" "}
                        <span className="text-purple-400 italic">move you.</span>
                    </h1>

                    <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
                        Find the best local events, workshops, and concerts curated just for you.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl sm:rounded-full shadow-2xl overflow-visible">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0">

                                {/* Search Input */}
                                <div className="relative flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-0 sm:flex-1 text-gray-600 border-b sm:border-b-0 sm:border-r border-gray-200">
                                    <Search size={17} className="shrink-0 text-purple-500" />
                                    <input
                                        type="text"
                                        placeholder="What's the occasion?"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent py-1"
                                    />
                                    {/* Autocomplete Dropdown */}
                                    {suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-xl rounded-xl z-50 overflow-hidden border border-gray-100">
                                            {suggestions.map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={() => {
                                                        setQuery(event.title);
                                                        setSuggestions([]);
                                                    }}
                                                    className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between transition-colors"
                                                >
                                                    <span className="font-medium">{event.title}</span>
                                                    <span className="text-xs text-purple-400 bg-purple-50 px-2 py-0.5 rounded-full">
                                                        {event.category}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Location Input */}
                                <div className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-0 sm:flex-1 text-gray-600 border-b sm:border-b-0 sm:border-r border-gray-200">
                                    <MapPin size={17} className="shrink-0 text-purple-500" />
                                    <input
                                        type="text"
                                        placeholder="Near me"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent py-1"
                                    />
                                </div>

                                {/* Date Input */}
                                <div className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-0 sm:flex-1 text-gray-600">
                                    <Calendar size={17} className="shrink-0 text-purple-500" />
                                    <input
                                        type="text"
                                        placeholder="When?"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent py-1"
                                    />
                                </div>

                                {/* Search Button */}
                                <div className="p-2 sm:p-1.5">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-7 py-3 rounded-xl sm:rounded-full text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition-all duration-200 whitespace-nowrap"
                                    >
                                        Search
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;