import { Search, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchEvents } from "../api/eventApi"

const Hero = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");

    const [suggestions,
        setSuggestions] =
        useState([]);

    useEffect(() => {

        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const load = async () => {
            try {
                const { data } = await searchEvents({
                    search: query,
                    limit: 5
                });

                if (data.success) {
                    setSuggestions(data.events);
                }

            }
            catch (err) {
                console.log(err);
            }
        };

        const timer = setTimeout(load, 300);
        return () => clearTimeout(timer);

    }, [query]);

    const handleSearch = () => {
        navigate(
            `/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(
                location
            )}&date=${encodeURIComponent(date)}`
        );
    };

    return (
        <div className="relative bg-black">
            <div
                className="h-[600px] bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2')",
                }}
            >
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                        Discover experiences <br />
                        that <span className="text-purple-500 italic">move you.</span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
                        Find the best local events, workshops, and concerts curated just
                        for you.
                    </p>

                    <div className="mt-10 bg-white lg:rounded-full  shadow-2xl p-3 flex flex-col md:flex-row items-center gap-3 max-w-4xl mx-auto relative">

                        {/* SEARCH */}
                        <div className="flex items-center gap-2 px-4 flex-1 text-gray-600 relative">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="What's the occasion?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full outline-none"
                            />

                            {/* AUTOCOMPLETE DROPDOWN */}
                            {suggestions.length > 0 && (
                                <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-xl z-50">
                                    {suggestions.map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={() => setQuery(event.title)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                            {event.title}
                                            <span className="text-xs text-gray-400 ml-2">
                                                ({event.category})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block h-8 w-px bg-gray-200" />

                        {/* LOCATION */}
                        <div className="flex items-center gap-2 px-4 flex-1 text-gray-600">
                            <MapPin size={18} />
                            <input
                                type="text"
                                placeholder="Near me"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>

                        <div className="hidden md:block h-8 w-px bg-gray-200" />

                        {/* DATE */}
                        <div className="flex items-center gap-2 px-4 flex-1 text-gray-600">
                            <Calendar size={18} />
                            <input
                                type="text"
                                placeholder="When?"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
                        >
                            Search
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;