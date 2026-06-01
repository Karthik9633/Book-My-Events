import Event from "../models/eventModel.js";
import Favorite from "../models/favoriteModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import RSVP from "../models/rsvpModel.js";

// Create Event 
export const createEvent = async (req, res) => {
    try {
        const {
            title, description, category, date,
            startTime, endTime, location,
            priceType, price, ticketTiers, images, tags,
        } = req.body;

        let derivedPrice = price ?? 0;
        if (ticketTiers?.length) {
            const prices = ticketTiers.map((t) => Number(t.price)).filter((p) => !isNaN(p));
            if (prices.length) derivedPrice = Math.min(...prices);
        }

        const event = await Event.create({
            title, description, category, date, startTime, endTime, location,
            priceType,
            price: derivedPrice,
            ticketTiers: ticketTiers ?? [],
            images: images ?? [],
            tags: tags ?? [],
            organizer: req.user.id,
        });

        const populated = await Event.findById(event._id)
            .populate("organizer", "name email")
            .populate("category", "name");

        res.status(201).json({ success: true, message: "Event created successfully", event: populated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({  status: "approved",date: { $gte: new Date() } })
            .populate("organizer", "name email")
            .populate("category", "name")
            .sort({ date: 1 });

        res.json({ success: true, count: events.length, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Event
export const getSingleEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id.trim())
            .populate("organizer", "name email")
            .populate("category", "name");

        if (!event)
            return res.status(404).json({ success: false, message: "Event not found" });

        event.views += 1;
        await event.save();

        res.json({ success: true, event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Event
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id.trim());
        if (!event)
            return res.status(404).json({ success: false, message: "Event not found" });

        if (event.organizer.toString() !== req.user.id && req.user.role !== "admin")
            return res.status(403).json({ success: false, message: "Not authorized" });

        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        })
            .populate("category", "name")
            .populate("organizer", "name email");

        res.json({ success: true, message: "Event updated", event: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id.trim());
        if (!event)
            return res.status(404).json({ success: false, message: "Event not found" });

        if (event.organizer.toString() !== req.user.id && req.user.role !== "admin")
            return res.status(403).json({ success: false, message: "Not authorized" });

        await event.deleteOne();
        // Clean up related data
        await Favorite.deleteMany({ event: req.params.id });
        await RSVP.deleteMany({ event: req.params.id });

        res.json({ success: true, message: "Event deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search & Filter Events
// ✅ FIX: Always filter out past events; merge with user date range if provided
export const searchEvents = async (req, res) => {
    try {
        const {
            search = "",
            category,
            city,
            priceType,
            startDate,
            endDate,
            maxPrice,
            tags,
            sort = "latest",
            page = 1,
            limit = 9,
        } = req.query;

        const query = {};

        // ✅ FIX: Default to upcoming events only — always filter out past events
        // If user provides a startDate, use whichever is later (now vs their startDate)
        const now = new Date();
        query.date = { $gte: now };

        if (search.trim()) {
            const keyword = search.trim();
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { tags: { $elemMatch: { $regex: keyword, $options: "i" } } },
            ];
        }

        // Category filter (ObjectId)
        if (category) {
            query.category = category;
        }

        // City filter (case-insensitive)
        if (city) {
            query["location.city"] = { $regex: city.trim(), $options: "i" };
        }

        // Price type filter
        if (priceType && ["free", "paid"].includes(priceType)) {
            query.priceType = priceType;
        }

        // Max price filter
        if (maxPrice !== undefined && maxPrice !== "") {
            query.price = { $lte: Number(maxPrice) };
        }

        // Date range filter — merged with the "future only" base filter above
        if (startDate || endDate) {
            if (startDate) {
                const userStart = new Date(startDate);
                // Use whichever is later: now or user's startDate
                query.date.$gte = userStart > now ? userStart : now;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        // Tags filter (comma-separated)
        if (tags) {
            const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
            if (tagArr.length) query.tags = { $in: tagArr };
        }

        // Sort options
        let sortOption = { date: 1 }; // default: soonest first makes more sense for upcoming events
        if (sort === "latest") sortOption = { createdAt: -1 };
        else if (sort === "popular") sortOption = { bookmarks: -1, views: -1 };
        else if (sort === "date-asc") sortOption = { date: 1 };
        else if (sort === "price-asc") sortOption = { price: 1 };
        else if (sort === "price-desc") sortOption = { price: -1 };

        const skip = (Number(page) - 1) * Number(limit);

        const [events, total] = await Promise.all([
            Event.find(query)
                .populate("category", "name")
                .populate("organizer", "name email")
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit)),
            Event.countDocuments(query),
        ]);

        res.json({
            success: true,
            events,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Events for Organizer
// Note: organizer's own dashboard shows all their events including past ones
export const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.id })
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: events.length, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle Favorite 
export const toggleFavorite = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event)
            return res.status(404).json({ success: false, message: "Event not found" });

        const existing = await Favorite.findOne({ user: userId, event: eventId });

        if (existing) {
            await existing.deleteOne();
            event.bookmarks = Math.max(0, event.bookmarks - 1);
            await event.save();
            return res.json({
                success: true,
                isFavorite: false,
                message: "Removed from favorites"
            });
        }

        await Favorite.create({ user: userId, event: eventId });
        event.bookmarks += 1;
        await event.save();
        res.json({
            success: true,
            isFavorite: true,
            message: "Added to favorites"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User Favorites 
export const getUserFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id })
            .populate({
                path: "event",
                populate: [
                    { path: "category", select: "name" },
                    { path: "organizer", select: "name email" },
                ],
            })
            .sort({ savedAt: -1 });

        // Filter out any nulls (deleted events)
        const events = favorites
            .map((f) => f.event)
            .filter(Boolean);

        res.json({ success: true, count: events.length, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Favorite Event IDs for current user
export const getFavoriteIds = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id }).select("event");
        const ids = favorites.map((f) => f.event.toString());
        res.json({ success: true, favoriteIds: ids });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRSVP = async (req, res) => {
    try {
        const { status } = req.body;
        const eventId = req.params.id;
        const userId = req.user.id;
        if (!["interested", "going", "none"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid RSVP status"
            });
        }
        const existingRSVP = await RSVP.findOne({ user: userId, event: eventId });
        if (status === "none") {
            if (existingRSVP) {
                await existingRSVP.deleteOne();
            }
            return res.json({ success: true, userStatus: null });
        }
        if (existingRSVP) {
            existingRSVP.status = status;
            await existingRSVP.save();
        } else {
            await RSVP.create({ user: userId, event: eventId, status });
        }
        return res.json({ success: true, userStatus: status });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRSVP = async (req, res) => {
    try {
        const eventId = req.params.id;
        const interested = await RSVP.countDocuments({ event: eventId, status: "interested" });
        const going = await RSVP.countDocuments({ event: eventId, status: "going" });
        let userStatus = null;
        if (req.user) {
            const rsvp = await RSVP.findOne({ user: req.user.id, event: eventId });
            userStatus = rsvp?.status || null;
        }
        res.json({ success: true, interested, going, userStatus });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Trending Events
// ✅ FIX: Only show upcoming events in trending
export const getTrendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gte: new Date() } })
            .populate("category", "name")
            .populate("organizer", "name email")
            .lean();

        const rsvpData = await RSVP.aggregate([
            {
                $group: {
                    _id: "$event",
                    interested: {
                        $sum: { $cond: [{ $eq: ["$status", "interested"] }, 1, 0] },
                    },
                    going: {
                        $sum: { $cond: [{ $eq: ["$status", "going"] }, 1, 0] },
                    },
                },
            },
        ]);

        const rsvpMap = new Map(
            rsvpData.map((item) => [item._id.toString(), item])
        );

        const trending = [];

        for (const event of events) {
            const rsvp = rsvpMap.get(event._id.toString()) || { interested: 0, going: 0 };
            const bookmarks = event.bookmarks || 0;
            const interested = rsvp.interested || 0;
            const going = rsvp.going || 0;
            const views = event.views || 0;

            if (bookmarks === 0 && interested === 0 && going === 0) { continue; }

            const score = bookmarks * 5 + interested * 10 + going * 20 + views * 0.05;

            trending.push({ ...event, trendingScore: score, interested, going });
        }

        trending.sort((a, b) => b.trendingScore - a.trendingScore);

        res.json({ success: true, events: trending.slice(0, 6) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEventAnalytics = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id.trim())
            .populate("category", "name")
            .populate("organizer", "name email");

        if (!event)
            return res.status(404).json({ success: false, message: "Event not found" });

        if (
            event.organizer._id.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        res.json({ success: true, event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};