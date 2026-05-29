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

  // Mobile filter drawer state
  const [filterOpen, setFilterOpen] = useState(false);

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

  const handleSetFilters = (filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  // Count active filters for the badge
  const activeFilterCount = [
    appliedFilters.category,
    appliedFilters.city,
    appliedFilters.priceType,
    appliedFilters.startDate,
    appliedFilters.endDate,
    appliedFilters.search,
    appliedFilters.maxPrice < 5000 ? "price" : "",
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:block">
        <FilterSidebar
          filters={appliedFilters}
          setFilters={handleSetFilters}
        />
      </div>

      {/* ── Mobile Filter Drawer Overlay ── */}
      {filterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFilterOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative z-10 w-80 max-w-[90vw] h-full bg-white overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
              <h2 className="font-bold text-lg">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none touch-manipulation p-1"
              >
                ✕
              </button>
            </div>
            <FilterSidebar
              filters={appliedFilters}
              setFilters={(filters) => {
                handleSetFilters(filters);
                // Optionally auto-close on apply — remove if FilterSidebar has its own Apply button
              }}
            />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 p-3 sm:p-4 lg:p-8 bg-gray-50">

        {/* Mobile filter toggle bar */}
        <div className="lg:hidden flex items-center justify-between mb-3 gap-3">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Inline sort on mobile */}
          <select
            value={sortOption}
            onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
            className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-medium touch-manipulation"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {/* Desktop results header */}
        <div className="hidden lg:block">
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
        </div>

        {/* Mobile results count */}
        <div className="lg:hidden text-sm text-gray-500 mb-3">
          {sortedEvents.length} event{sortedEvents.length !== 1 ? "s" : ""} found
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-2 lg:mt-8">
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
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