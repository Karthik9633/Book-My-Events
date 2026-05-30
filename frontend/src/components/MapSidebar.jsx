import { useMemo, useState } from "react";

import { Heart } from "lucide-react";

import { Link } from "react-router-dom";

const categories = [
  "All Events",
  "Music",
  "Technology",
  "Business",
  "Health",
  "Art",
  "Food",
];

const MapSidebar = ({
  events,
  selectedCategory,
  setSelectedCategory,
}) => {

  const [sortOption, setSortOption] =
    useState("DEFAULT");

  const categoryFiltered =
    selectedCategory === "ALL"
      ? events
      : events.filter(
        (event) =>
          (
            event.category?.name ||
            event.category
          )
            ?.toUpperCase()
          === selectedCategory
      );

  const filteredEvents = useMemo(() => {

    let sorted = [...categoryFiltered];

    if (sortOption === "LOW_HIGH") {

      sorted.sort(
        (a, b) =>
          (a.price || 0) -
          (b.price || 0)
      );

    }

    if (sortOption === "HIGH_LOW") {

      sorted.sort(
        (a, b) =>
          (b.price || 0) -
          (a.price || 0)
      );

    }

    if (sortOption === "NEWEST") {

      sorted.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    }

    return sorted;

  }, [categoryFiltered, sortOption]);

  return (

    <aside
      className="
                w-full
                lg:w-[420px]
                bg-white
                border-r
                border-gray-200
                flex
                flex-col
                h-full
            "
    >

      <div
        className="
                    p-6
                    border-b
                "
      >

        <div
          className="
                        flex
                        justify-between
                        items-center
                        mb-4
                    "
        >

          <h2
            className="
                            text-xl
                            font-bold
                        "
          >
            {filteredEvents.length}
            {" "}
            Events Nearby
          </h2>

          <select
            value={sortOption}
            onChange={(e) =>
              setSortOption(
                e.target.value
              )
            }
            className="
                            text-sm
                            bg-purple-100
                            text-purple-600
                            px-4
                            py-1
                            rounded-pill
                            font-medium
                            outline-none
                            cursor-pointer
                        "
          >

            <option value="DEFAULT">
              Sort
            </option>

            <option value="LOW_HIGH">
              Price: Low to High
            </option>

            <option value="HIGH_LOW">
              Price: High to Low
            </option>

            <option value="NEWEST">
              Newest
            </option>

          </select>

        </div>

        <div
          className="
                        flex
                        gap-2
                        overflow-x-auto
                    "
        >

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(
                  cat
                )
              }
              className={`
                                px-3
                                py-2
                                text-xs
                                rounded-full
                                font-semibold
                                transition

                                ${selectedCategory ===
                  cat
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
                            `}
            >
              {cat}
            </button>

          ))}

        </div>

      </div>

      <div
        className="
                    flex-1
                    overflow-y-auto
                    p-6
                    space-y-6
                "
      >

        {filteredEvents.map((event) => (

          <div
            key={event._id}
            className="
                            bg-white
                            rounded-2xl
                            shadow-sm
                            border
                            border-gray-100
                        "
          >

            <div
              className="
                                relative
                            "
            >

              <img
                src={
                  event.images?.[0]
                }
                alt={
                  event.title
                }
                className="
                                    rounded-t-2xl
                                    w-full
                                    h-48
                                    object-cover
                                "
              />

              <button
                className="
                                    absolute
                                    top-4
                                    right-4
                                    bg-white
                                    p-2
                                    rounded-full
                                    shadow
                                "
              >
                <Heart
                  size={18}
                />
              </button>

              {event.price ===
                0 && (
                  <span
                    className="
                                        absolute
                                        top-4
                                        left-4
                                        bg-green-500
                                        text-white
                                        text-xs
                                        px-3
                                        py-1
                                        rounded-full
                                    "
                  >
                    FREE
                  </span>
                )}

            </div>

            <div
              className="
                                p-4
                            "
            >

              <div
                className="
                                    flex
                                    justify-between
                                    items-start
                                "
              >

                <h3
                  className="
                                        font-bold
                                        text-lg
                                        leading-tight
                                    "
                >
                  {event.title}
                </h3>

                <div
                  className="
                                        text-right
                                    "
                >

                  <p
                    className="
                                            font-bold
                                            text-lg
                                        "
                  >
                    {event.price ===
                      0
                      ? "Free"
                      : `₹${event.price}`}
                  </p>

                  <p
                    className="
                                            text-xs
                                            text-gray-400
                                        "
                  >
                    TICKETS
                  </p>

                </div>

              </div>

              <p
                className="
                                    text-gray-500
                                    text-sm
                                    mt-2
                                "
              >
                📍{" "}
                {
                  event.location
                    ?.city
                }
                ,
                {" "}
                {
                  event.location
                    ?.state
                }
              </p>

              <p
                className="
                                    text-purple-600
                                    text-sm
                                    mt-1
                                    font-medium
                                "
              >
                {new Date(
                  event.date
                ).toLocaleDateString()}
              </p>

              <Link
                to={`/event/${event._id}`}
              >

                <button
                  className="
                                        mt-4
                                        w-full
                                        bg-purple-600
                                        text-white
                                        py-2
                                        rounded-xl
                                        font-semibold
                                        hover:bg-purple-700
                                        transition
                                    "
                >
                  View Details
                </button>

              </Link>

            </div>

          </div>

        ))}

        {filteredEvents.length ===
          0 && (
            <p
              className="
                            text-gray-500
                            text-center
                            mt-10
                        "
            >
              No events found.
            </p>
          )}

      </div>

    </aside>

  );

};

export default MapSidebar;