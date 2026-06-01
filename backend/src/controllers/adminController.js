import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import Ticket from "../models/ticketModel.js";
import Favorite from "../models/favoriteModel.js";
import RSVP from "../models/rsvpModel.js";
import sendEmail from "../utils/sendEmail.js";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalOrganizers, totalEvents, activeEvents, totalBookings] =
            await Promise.all([
                User.countDocuments(),
                User.countDocuments({ role: "organizer" }),
                Event.countDocuments(),
                Event.countDocuments({ date: { $gte: new Date() } }),
                Ticket.countDocuments(),
            ]);

        res.json({
            success: true,
            stats: { totalUsers, totalOrganizers, totalEvents, activeEvents, totalBookings },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.isActive = !user.isActive;
        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.role = role;
        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Ticket.find()
            .populate("user", "name email")
            .populate("event", "title date")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Revenue ──────────────────────────────────────────────────────────────────

export const getRevenueStats = async (req, res) => {
    try {
        const tickets = await Ticket.find();

        const totalRevenue = tickets.reduce((sum, t) => sum + (t.total || 0), 0);
        const ticketsSold = tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
        const totalBookings = tickets.length;
        const uniqueEvents = [...new Set(tickets.map((t) => t.event?.toString()))].length;

        res.json({ success: true, stats: { totalRevenue, ticketsSold, totalBookings, uniqueEvents } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const getAnalytics = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate("event");

        const monthlyRevenue = {};

        tickets.forEach((ticket) => {
            const month = new Date(ticket.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (ticket.total || 0);
        });

        res.json({ success: true, monthlyRevenue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Events ───────────────────────────────────────────────────────────────────

// Admin sees ALL events (including past) for moderation
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("organizer", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ ADDED: was missing, imported from authController by mistake
export const approveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        event.status = "approved";
        await event.save();

        res.json({ success: true, message: "Event approved", event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ ADDED: was missing, imported from authController by mistake
export const rejectEvent = async (req, res) => {
    try {
        const { reason } = req.body;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        event.status = "rejected";
        event.rejectionReason = reason || "No reason provided";
        await event.save();

        res.json({ success: true, message: "Event rejected", event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ ADDED: was missing, imported from authController by mistake
export const deleteEventAdmin = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        await event.deleteOne();
        await Favorite.deleteMany({ event: req.params.id });
        await RSVP.deleteMany({ event: req.params.id });

        res.json({ success: true, message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const sendNewsletter = async (req, res) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message)
            return res.status(400).json({ success: false, message: "Subject and message are required" });

        const users = await User.find({ isActive: true });

        // Send in parallel (no await per-user — faster, non-blocking)
        await Promise.allSettled(
            users.map((user) => sendEmail(user.email, subject, message))
        );

        res.json({ success: true, message: `Newsletter sent to ${users.length} users` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};