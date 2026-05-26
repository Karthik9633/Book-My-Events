import express from "express";
import protect from "../middleware/authMiddleware.js";
import {addBookmark,removeBookmark,getBookmarks,} from "../controllers/bookmarkController.js";

const router = express.Router();


// ADD BOOKMARK
router.post("/",protect,addBookmark)


// REMOVE BOOKMARK
router.delete("/:eventId",protect,removeBookmark);


// GET USER BOOKMARKS
router.get("/",protect,getBookmarks);

export default router