import { sendNewsletterEmail } from "../utils/sendEmail.js";

export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        await sendNewsletterEmail(email);

        res.json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
        console.log("NEWSLETTER ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to subscribe" });
    }
};