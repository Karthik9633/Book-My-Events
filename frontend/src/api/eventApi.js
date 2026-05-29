import API from "./axios";
export const fetchEvents = () => API.get("/events");
export const fetchEvent = (id) => API.get(`/events/${id}`);

/**
 * @param {Object} params 
 */
export const searchEvents = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null
    )
  );
  return API.get("/events/search", { params: clean });
};

export const createEvent = (data) => API.post("/events", data);

export const updateEvent = (id, data) => API.put(`/events/${id}`, data);

export const deleteEvent = (id) => API.delete(`/events/${id}`);

export const fetchMyEvents = () => API.get("/events/user/my-events");

export const fetchTrendingEvents = () => API.get("/events/trending");

//  RSVP

export const fetchRSVP = (eventId) => API.get(`/events/${eventId}/rsvp`);

export const updateRSVP = (eventId, status) =>
  API.post(`/events/${eventId}/rsvp`, { status });

// Favorites

export const toggleFavorite = (eventId) =>
  API.post(`/events/${eventId}/favorite`);

export const fetchFavorites = () => API.get("/events/user/favorites");

export const fetchFavoriteIds = () => API.get("/events/user/favorite-ids");

export const fetchCategories = () => API.get("/categories");

export const createOrder = (amount) => API.post("/payments/create-order", { amount });

export const fetchMyTickets = () => API.get("/payments/my-tickets");