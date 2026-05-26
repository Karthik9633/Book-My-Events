import Bookmark from "../models/Bookmark.js";

// ADD BOOKMARK
export const addBookmark = async (req, res) => {

    try {

        const { eventId } = req.body;
        const exists = await Bookmark.findOne({ userId: req.user.id, eventId });

        if (exists) {
            return res.status(400).json({ message: "Already bookmarked" });
        }
        const bookmark = await Bookmark.create({ userId: req.user.id, eventId });
        res.status(201).json(bookmark);

    } catch (error) {
        res.status(500).json({ message: error.message, });
    }
};



// REMOVE BOOKMARK
export const removeBookmark = async (req, res) => {

    try {

        await Bookmark.findOneAndDelete({
            userId: req.user.id,
            eventId: req.params.eventId,
        })

        res.json({ message: "Bookmark removed" });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};



// GET USER BOOKMARKS
export const getBookmarks = async (req, res) => {
    try {

        const bookmarks = await Bookmark.find({ userId: req.user.id }).populate(
            {
                path: "eventId",

                populate: {
                    path: "categoryId",
                    select: "name",
                },
            });

        res.json(bookmarks);

    } catch (error) {

        res.status(500).json({ message: error.message, });

    }
};