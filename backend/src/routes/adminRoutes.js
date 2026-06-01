import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
    getDashboardStats,
    getAllUsers,
    toggleUserStatus,
    changeUserRole,
    getAllBookings,
    getRevenueStats,
    getAllEvents,
    approveEvent,       
    rejectEvent,        
    deleteEventAdmin,   
    getAnalytics,
    sendNewsletter,
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// Users
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/status", protect, adminOnly, toggleUserStatus);
router.put("/users/:id/role", protect, adminOnly, changeUserRole);

// Bookings
router.get("/bookings", protect, adminOnly, getAllBookings);

// Revenue
router.get("/revenue", protect, adminOnly, getRevenueStats);

// Analytics
router.get("/analytics", protect, adminOnly, getAnalytics);

// Events
router.get("/events", protect, adminOnly, getAllEvents);
router.put("/events/:id/approve", protect, adminOnly, approveEvent);
router.put("/events/:id/reject", protect, adminOnly, rejectEvent);
router.delete("/events/:id", protect, adminOnly, deleteEventAdmin);

// Newsletter
router.post("/newsletter", protect, adminOnly, sendNewsletter);

export default router;