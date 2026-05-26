import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import EventGridCard from "../components/EventGridCard";
import ResultsHeader from "../components/ResultsHeader";
import Pagination from "../components/Pagination";
import { searchEvents } from "../api/eventApi";

const EVENTS_PER_PAGE = 6;

const SearchResults = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const searchLocation = searchParams.get("location") || "";

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    category: "",
    city: "",
    priceType: "",
    startDate: "",
    endDate: "",
    maxPrice: 5000,
    sort: "latest",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("recommended");

  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = {
          search: appliedFilters.search || searchQuery || "",
          city: appliedFilters.city || searchLocation || "",
          category: appliedFilters.category || "",
          priceType: appliedFilters.priceType || "",
          startDate: appliedFilters.startDate || "",
          endDate: appliedFilters.endDate || "",
          maxPrice: appliedFilters.maxPrice || "",
          limit: 100,
          page: 1,
          sort: appliedFilters.sort || "latest",
        };

        const { data } = await searchEvents(params);
        if (data.success) {
          const normalized = data.events.map((ev) => ({
            id: ev._id,
            title: ev.title,

            // ── FIX: keep categoryId separate from categoryName ──────────────
            // categoryId is used for FilterSidebar matching (ObjectId string)
            // categoryName is the human-readable label shown in the card
            categoryId: ev.category?._id || "",
            categoryName: ev.category?.name || "",

            date: ev.date
              ? new Date(ev.date).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : "",
            calenderDate: ev.date ?? "",
            location: ev.location
              ? `${ev.location.city}, ${ev.location.state}`
              : "",
            price: ev.price ?? 0,
            priceType: ev.priceType ?? "free",
            image:
              ev.images?.[0] ??
              `https://picsum.photos/seed/${ev._id}/640/360`,
          }));
          setAllEvents(normalized);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [appliedFilters, searchQuery, searchLocation]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const { category, maxPrice, startDate, endDate, search } = appliedFilters;

      // ── FIX: compare against categoryId, not the old .category field ───────
      const categoryMatch = !category || event.categoryId === category;

      const priceMatch = event.price <= maxPrice;

      const sidebarSearchMatch =
        !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.categoryName.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase());

      const heroQueryMatch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const locationMatch =
        !searchLocation ||
        event.location.toLowerCase().includes(searchLocation.toLowerCase());

      const eventDate = new Date(event.calenderDate);
      const startMatch = !startDate || eventDate >= new Date(startDate);
      const endMatch = !endDate || eventDate <= new Date(endDate);

      return (
        categoryMatch &&
        priceMatch &&
        sidebarSearchMatch &&
        heroQueryMatch &&
        locationMatch &&
        startMatch &&
        endMatch
      );
    });
  }, [allEvents, appliedFilters, searchQuery, searchLocation]);

  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents];
    if (sortOption === "low") sorted.sort((a, b) => a.price - b.price);
    else if (sortOption === "high") sorted.sort((a, b) => b.price - a.price);
    else if (sortOption === "newest")
      sorted.sort((a, b) => new Date(b.calenderDate) - new Date(a.calenderDate));
    return sorted;
  }, [filteredEvents, sortOption]);

  const totalPages = Math.ceil(sortedEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <FilterSidebar
        filters={appliedFilters}
        setFilters={(filters) => {
          setAppliedFilters(filters);
          setCurrentPage(1);
        }}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
        <ResultsHeader
          total={sortedEvents.length}
          currentPage={currentPage}
          eventsPerPage={EVENTS_PER_PAGE}
          sortOption={sortOption}
          setSortOption={(value) => {
            setSortOption(value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
                // Pass categoryName so the card displays it correctly
                <EventGridCard
                  key={event.id}
                  event={{ ...event, category: event.categoryName }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                No events found matching your filters.
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResults;