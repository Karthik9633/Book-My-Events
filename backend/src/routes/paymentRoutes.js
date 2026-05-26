import express from "express";
import { createOrder, verifyAndSendTicket} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order",createOrder);
router.post("/verify", verifyAndSendTicket);

export default router;