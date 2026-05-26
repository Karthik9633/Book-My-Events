import Razorpay from "razorpay"
import crypto from "crypto"
import { sendTicketEmail } from "../utils/sendEmail.js" 
import Event from "../models/eventModel.js" 

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

        res.json({ success: true, message: "Ticket sent to email" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}