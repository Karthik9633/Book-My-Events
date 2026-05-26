import { useState, useEffect } from "react";
import { fetchCategories } from "../api/eventApi";

const DEFAULT_FILTERS = {
  search: "",
  category: "",
  city: "",
  priceType: "",
  startDate: "",
  endDate: "",
  maxPrice: 5000,
  sort: "latest",
};

const FilterSidebar = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [local, setLocal] = useState(filters ?? DEFAULT_FILTERS);


  useEffect(() => {
    fetchCategories()
      .then(({ data }) => setCategories(data.categories ?? []))
      .catch(() => { });
  }, []);


  useEffect(() => {
    setFilters(local);
  }, [local]);

  const set = (key, value) => { const updated = { ...local, [key]: value }; setLocal(updated); setFilters(updated); }

  const reset = () => {
    setLocal(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0 bg-[#f9fafc] border-r min-h-screen p-6">

      {/* Search */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
          Search
        </h3>
        <input
          type="text"
          placeholder="Search events, tags…"
          value={local.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
        />
      </div>

      {/* Category */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
          Category
        </h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={local.category === ""}
              onChange={() => set("category", "")}
              className="accent-purple-600"
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={local.category === cat._id}
                onChange={() => set("category", cat._id)}
                className="accent-purple-600"
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
          City
        </h3>
        <input
          type="text"
          placeholder="e.g. Mumbai, Kochi…"
          value={local.city}
          onChange={(e) => set("city", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
        />
      </div>

      {/* Price Type */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
          Price Type
        </h3>
        <div className="flex gap-2">
          {["", "free", "paid"].map((type) => (
            <button
              key={type}
              onClick={() => set("priceType", type)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${local.priceType === type
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
                }`}
            >
              {type === "" ? "Any" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price */}
      {local.priceType !== "free" && (
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
            Max Price
          </h3>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={local.maxPrice}
            onChange={(e) => set("maxPrice", Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <div className="text-sm text-purple-600 mt-1 font-medium">
            Up to ₹{local.maxPrice.toLocaleString()}
          </div>
        </div>
      )}

      {/* Date Range */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
          Date Range
        </h3>
        <input
          type="date"
          value={local.startDate}
          onChange={(e) => set("startDate", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="date"
          value={local.endDate}
          onChange={(e) => set("endDate", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Sort */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
          Sort By
        </h3>
        <select
          value={local.sort}
          onChange={(e) => set("sort", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="latest">Latest First</option>
          <option value="popular">Most Popular</option>
          <option value="date-asc">Soonest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="w-full text-sm text-center text-gray-400 hover:text-purple-600 transition py-2"
      >
        Reset all filters
      </button>
    </aside>
  );
};

export { DEFAULT_FILTERS };
export default FilterSidebar;