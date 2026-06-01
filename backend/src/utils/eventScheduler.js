import cron from "node-cron";
import Event from "../models/eventModel.js";
import Favorite from "../models/favoriteModel.js";
import RSVP from "../models/rsvpModel.js";

const getEventEndDateTime = (event) => {
    const rawTime = event.endTime || "23:59";
    const parts = rawTime.split(":").map(Number);
    const hours = isNaN(parts[0]) ? 23 : parts[0];
    const minutes = isNaN(parts[1]) ? 59 : parts[1];

    const dt = new Date(event.date);
    dt.setHours(hours, minutes, 0, 0);
    return dt;
};

const cleanupExpiredEvents = async () => {
    try {
        const now = new Date();

        const pastEvents = await Event.find({ date: { $lt: now } });

        if (!pastEvents.length) return;

        const toDelete = [];

        for (const event of pastEvents) {
            const endDateTime = getEventEndDateTime(event);
            const oneHourAfterEnd = new Date(endDateTime.getTime() + 60 * 60 * 1000);

            if (now >= oneHourAfterEnd) {
                toDelete.push(event._id);
                console.log(`🗑️  Scheduled deletion: "${event.title}" (ended at ${endDateTime.toISOString()})`);
            }
        }

        if (!toDelete.length) return;

        await Promise.all([
            Event.deleteMany({ _id: { $in: toDelete } }),
            Favorite.deleteMany({ event: { $in: toDelete } }),
            RSVP.deleteMany({ event: { $in: toDelete } }),
        ]);

        console.log(`✅ Auto-deleted ${toDelete.length} expired event(s).`);
    } catch (err) {
        console.error("❌ Event cleanup scheduler error:", err.message);
    }
};

export const startEventCleanupScheduler = () => {
    cron.schedule("*/5 * * * *", async () => {
        await cleanupExpiredEvents();
    });
    cleanupExpiredEvents();

    console.log("✅ Event cleanup scheduler started (runs every 5 minutes).");
};