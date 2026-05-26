import express from "express"
import {
    createEvent,
    getEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    getMyEvents,
    toggleFavorite,
    getUserFavorites,
    getFavoriteIds,
    updateRSVP,
    getRSVP,
    getTrendingEvents,
} from "../controllers/eventController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

/* PUBLIC */

router.get("/", getEvents)
router.get("/search", searchEvents)
router.get("/trending", getTrendingEvents)

// USER 

router.get("/user/my-events", protect, getMyEvents)
router.get("/user/favorites", protect, getUserFavorites)
router.get("/user/favorite-ids", protect, getFavoriteIds)

// RSVP 

router.get("/:id/rsvp", protect, getRSVP)
router.post("/:id/rsvp", protect, updateRSVP)

//CRUD 

router.post("/", protect, createEvent)
router.put("/:id", protect, updateEvent)
router.delete("/:id", protect, deleteEvent)

// FAVORITES

router.post("/:eventId/favorite", protect, toggleFavorite)

router.get("/:id", getSingleEvent)

export default router