import API from "./axios";

export const getDashboardStats = () => API.get("/admin/dashboard");
export const getRevenueStats = () => API.get("/admin/revenue");
export const getAllUsers = () => API.get("/admin/users");
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/status`);
export const changeUserRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const getAllBookings = () => API.get("/admin/bookings");
export const getAllEvents = () => API.get("/admin/events");
export const approveEvent = (id) => API.put(`/admin/events/${id}/approve`);
export const rejectEvent = (id, reason) => API.put(`/admin/events/${id}/reject`, { reason });
export const deleteEventAdmin = (id) => API.delete(`/admin/events/${id}`);
export const getAnalytics = () => API.get("/admin/analytics");
export const sendNewsletter =(data) =>API.post("/admin/newsletter",data);