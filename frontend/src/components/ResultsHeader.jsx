import { LayoutGrid, Map, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const ResultsHeader = ({
  total,
  currentPage,
  eventsPerPage,
  sortOption,
  setSortOption
}) => {

  const start = (currentPage - 1) * eventsPerPage + 1;
  const end = Math.min(currentPage * eventsPerPage, total);

  return (
    <div className="mb-8">

      {/* TOP ROW */}
      <div className="flex justify-between items-start mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            All Events From Your Locality
          </h1>
          <p className="text-gray-500 mt-1">
            {total} experiences found
          </p>
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white shadow text-gray-900">
            <LayoutGrid size={16} />
            Grid
          </button>

          <Link to="/map"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500"
          >
            <Map size={16} />
            Map
          </Link>

          <Link to="/Calendar"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500"
          >
            <Calendar size={16} />
            Calendar
          </Link>

        </div>
      </div>

      {/* SECOND ROW */}
      <div className="flex justify-between items-center text-sm">

        {/* SORT */}
        <div className="flex items-center gap-2 text-gray-600">
          <span>Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent font-medium text-gray-900 outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* SHOWING COUNT */}
        <div className="text-gray-500">
          Showing {total === 0 ? 0 : start}–{end} of {total}
        </div>

      </div>

    </div>
  );
};

export default ResultsHeader;