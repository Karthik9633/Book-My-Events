import express from "express";
import { createOrder, verifyAndSendTicket, getMyTickets } from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", protect, verifyAndSendTicket);
router.get("/my-tickets", protect, getMyTickets);
export default router;