import { useState, useMemo, useEffect } from "react";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import { fetchEvents } from "../api/eventApi";

import { Link } from "react-router-dom";

const categories = [
  "All Events",

  "Music",

  "Technology",

  "Business",

  "Health",

  "Art",

  "Food & Drink",
];

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedCategory, setSelectedCategory] = useState("All Events");

  const [freeOnly, setFreeOnly] = useState(false);

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchEvents();

        if (data.success) {
          setEvents(
            data.events.map((event) => ({
              ...event,

              calendarDate: event.date,

              price: event.price || 0,

              image: event.images?.[0] || "https://picsum.photos/400",

              locationText: event.location
                ? `${event.location.address},

${event.location.city}`
                : "Location TBA",
            }))
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const nextMonth = () =>
    setCurrentMonth(
      addMonths(
        currentMonth,

        1
      )
    );

  const prevMonth = () =>
    setCurrentMonth(
      subMonths(
        currentMonth,

        1
      )
    );

  const monthStart = startOfMonth(currentMonth);

  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart);

  const endDate = endOfWeek(monthEnd);

  const days = [];

  let day = startDate;

  while (day <= endDate) {
    days.push(day);

    day = addDays(
      day,

      1
    );
  }

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!event.calendarDate) return false;

      const eventDate = parseISO(event.calendarDate);

      if (!eventDate) return false;

      const category = (event.category?.name || event.category || "").toLowerCase().trim();
      const selected = selectedCategory.toLowerCase().trim();

      const matchCategory = selected === "all events" || category.includes(selected);
      const matchFree = freeOnly ? event.price === 0 : true;
      return matchCategory && matchFree;
    });
  }, [events, selectedCategory, freeOnly]);

  const selectedDayEvents = filteredEvents.filter((event) =>
    isSameDay(
      parseISO(event.calendarDate),

      selectedDate
    )
  );

  if (loading) {
    return (
      <div
        className="

min-h-screen

flex

items-center

justify-center

"
      >
        Loading Calendar...
      </div>
    );
  }

  return (
    <div
      className="

flex

bg-gray-100

min-h-screen

"
    >
      <aside
        className="

w-72

bg-white

border-r

p-6

hidden

lg:flex

flex-col

gap-8

"
      >
        <div>
          <h3
            className="

text-xs

font-bold

text-gray-400

uppercase

mb-4

"
          >
            Categories
          </h3>

          <div
            className="

space-y-3

"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`

w-full

text-left

px-4

py-3

rounded-xl

${selectedCategory === cat ? "bg-purple-100 text-purple-700 font-semibold" : ""}

`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            className="

flex

gap-2

items-center

"
          >
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={() => setFreeOnly(!freeOnly)}
            />
            Free Events Only
          </label>
        </div>
      </aside>

      <main
        className="

flex-1

bg-white

flex

flex-col

"
      >
        <div
          className="

p-6

border-b

flex

justify-between

items-center

"
        >
          <h2
            className="

text-3xl

font-bold

"
          >
            {format(
              currentMonth,

              "MMMM yyyy"
            )}
          </h2>

          <div
            className="

flex

gap-2

"
          >
            <button onClick={prevMonth}>
              <ChevronLeft />
            </button>

            <button
              onClick={() => {
                setCurrentMonth(new Date());

                setSelectedDate(new Date());
              }}
            >
              Today
            </button>

            <button onClick={nextMonth}>
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          className="

grid

grid-cols-7

"
        >
          {days.map((d, i) => {
            const dayEvents = filteredEvents.filter((event) =>
              isSameDay(
                parseISO(event.calendarDate),

                d
              )
            );

            return (
              <div
                key={i}
                onClick={() => setSelectedDate(d)}
                className={`

border

p-2

min-h-[120px]

cursor-pointer

${isSameDay(
                  d,

                  selectedDate
                )
                    ? "bg-purple-50"
                    : ""
                  }

`}
              >
                <div>
                  {format(
                    d,

                    "d"
                  )}
                </div>

                {dayEvents

                  .slice(
                    0,

                    2
                  )

                  .map((event) => (
                    <div
                      key={event._id}
                      className="

bg-purple-600

text-white

rounded

px-2

py-1

text-xs

mt-1

truncate

"
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>

        <div
          className="

flex

justify-center

py-6

"
        >
          <Link
            to="/map"
            className="

bg-black

text-white

px-6

py-3

rounded-full

"
          >
            🗺 Show Map
          </Link>
        </div>
      </main>

      <aside
        className="

w-[380px]

bg-white

border-l

p-6

hidden

xl:flex

flex-col

"
      >
        <h2
          className="

font-bold

text-2xl

"
        >
          {format(
            selectedDate,

            "MMMM d yyyy"
          )}
        </h2>

        <div
          className="

mt-6

space-y-6

"
        >
          {selectedDayEvents.length === 0 ? (
            <p>No events</p>
          ) : (
            selectedDayEvents.map((event) => (
              <div
                key={event._id}
                className="

bg-gray-50

rounded-2xl

p-4

"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="

w-full

h-40

rounded-xl

object-cover

"
                />

                <h3>{event.title}</h3>

                <p
                  className="

flex

gap-1

"
                >
                  <MapPin size={14} />

                  {event.locationText}
                </p>

                <Link
                  to={`/event/${event._id}`}
                  className="

text-purple-600

"
                >
                  View Details →
                </Link>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

export default CalendarPage;