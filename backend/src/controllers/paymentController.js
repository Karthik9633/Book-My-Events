import Razorpay from "razorpay"
import crypto from "crypto"
import { sendTicketEmail } from "../utils/sendEmail.js"
import Event from "../models/eventModel.js"
import Ticket from "../models/ticketModel.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
})

// Create Order 
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        }
        const order = await razorpay.orders.create(options)
        res.json({ success: true, order })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

//  Verify Payment & Send Ticket Email 
export const verifyAndSendTicket = async (req, res) => {
    console.log("VERIFY ENDPOINT HIT", req.body)
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId,
            tierName,
            quantity,
            total,
            userEmail,
            userName,
        } = req.body

        // 1. Verify Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex")

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" })
        }

        // 2. Fetch event from DB
        const event = await Event.findById(eventId)
        if (!event) return res.status(404).json({ success: false, message: "Event not found" })

        const tier = event.ticketTiers.find(
            (t) => t.name === tierName
        );

        if (!tier) {
            return res.status(404).json({
                success: false,
                message: "Ticket tier not found",
            });
        }

        const qty = Number(quantity);

        const capacity = tier.capacity || Infinity;

        const sold = tier.sold || 0;

        const remaining = capacity - sold;

        if (qty > remaining) {
            return res.status(400).json({
                success: false,
                message: `Only ${remaining} tickets remaining for ${tierName}`,
            });
        }

        tier.sold += qty;

        await event.save();

        const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "short", year: "numeric",
        })

        const eventVenue = event.location
            ? `${event.location.address}, ${event.location.city}, ${event.location.state}`
            : "Venue TBD"



        // 3. Send ticket email
        await sendTicketEmail({
            to: userEmail,
            userName,
            eventTitle: event.title,
            eventDate,
            eventVenue,
            tierName,
            quantity,
            total,
            eventId,
        })

        await Ticket.create({
            user: req.user.id,
            event: event._id,
            eventTitle: event.title,
            image: event.images?.[0] || "",
            date: eventDate,
            location: eventVenue,
            tier: {
                name: tierName
            },
            quantity,
            total,
            paymentId: razorpay_payment_id,
        });

        res.json({ success: true, message: "Ticket sent to email" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            user: req.user.id
        }).populate({
            path: "event",
            select: "_id title"
        }).sort({
            createdAt: -1
        });
        
        res.json({
            success: true,
            tickets
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};