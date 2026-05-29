import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000
});

transporter.verify((error) => {
    if (error) {
        console.log("EMAIL ERROR:", error);
    } else {
        console.log("EMAIL SERVER READY");
    }
});

// OTP Email
const sendEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `BookMyEvent <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "BookMyEvent OTP Verification",
            html: `
                <div style="font-family:sans-serif; padding:20px;">
                    <h2>BookMyEvent Verification</h2>
                    <p>Your OTP:</p>
                    <h1>${otp}</h1>
                    <p>Expires in 10 minutes</p>
                </div>
            `,
        });
        console.log("OTP SENT:", info.messageId);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//Ticket Confirmation Email
export const sendTicketEmail = async ({
    to, userName, eventTitle, eventDate, eventVenue, tierName, quantity, total, eventId,
}) => {
    try {
        const info = await transporter.sendMail({
            from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
            to,
            subject: `Your Ticket for ${eventTitle} 🎟️`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #7C3AED; padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Booking Confirmed!</h1>
                    <p style="color: #e9d5ff; margin-top: 8px;">Your ticket is ready</p>
                </div>
                <div style="padding: 32px;">
                    <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>
                    <p style="color: #6b7280;">Your registration for the following event has been confirmed.</p>
                    <div style="background: #f5f3ff; border-left: 4px solid #7C3AED; border-radius: 12px; padding: 24px; margin: 24px 0;">
                        <h2 style="color: #7C3AED; margin: 0 0 16px;">${eventTitle}</h2>
                        <table style="width: 100%; font-size: 14px; color: #374151;">
                            <tr><td style="padding: 6px 0;"><strong>📅 Date</strong></td><td>${eventDate}</td></tr>
                            <tr><td style="padding: 6px 0;"><strong>📍 Venue</strong></td><td>${eventVenue}</td></tr>
                            <tr><td style="padding: 6px 0;"><strong>🎟 Ticket Type</strong></td><td>${tierName}</td></tr>
                            <tr><td style="padding: 6px 0;"><strong>👥 Quantity</strong></td><td>${quantity}</td></tr>
                            <tr><td style="padding: 6px 0;"><strong>💰 Total Paid</strong></td><td><strong style="color: #7C3AED;">₹${total}</strong></td></tr>
                            <tr><td style="padding: 6px 0;"><strong>🔖 Order #</strong></td><td>EV-${eventId}</td></tr>
                        </table>
                    </div>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.CLIENT_URL}/success/${eventId}"
                           style="background-color: #7C3AED; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold;">
                            View My Ticket
                        </a>
                    </div>
                </div>
                <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                    <p>This is an automated email from BookMyEvent. Please do not reply.</p>
                </div>
            </div>
            `,
        });
        console.log("TICKET EMAIL SENT:", info.messageId);
    } catch (error) {
        console.log("TICKET EMAIL ERROR:", error);
        throw error;
    }
};

//  Newsletter Welcome Email
export const sendNewsletterEmail = async (email) => {
    try {
        const info = await transporter.sendMail({
            from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to BookMyEvent Newsletter 🎉",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #7C3AED; padding: 40px 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 You're In!</h1>
                    <p style="color: #e9d5ff; margin-top: 8px; font-size: 16px;">Welcome to the BookMyEvent community</p>
                </div>
                <div style="padding: 32px;">
                    <p style="font-size: 16px; color: #111827;">Hey there! 👋</p>
                    <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
                        You've successfully subscribed to <strong>BookMyEvent</strong>.
                        Get ready for weekly updates on the best events happening near you — concerts, tech talks, food festivals, and more!
                    </p>
                    <div style="background: #f5f3ff; border-radius: 12px; padding: 24px; margin: 24px 0;">
                        <h3 style="color: #7C3AED; margin: 0 0 12px;">What to expect 📬</h3>
                        <ul style="color: #374151; font-size: 14px; line-height: 2; padding-left: 20px;">
                            <li>🔥 Weekly trending events near you</li>
                            <li>🎟️ Exclusive early-bird ticket offers</li>
                            <li>📍 Curated picks based on your city</li>
                            <li>🎁 Special subscriber-only discounts</li>
                        </ul>
                    </div>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.CLIENT_URL}"
                           style="background-color: #7C3AED; color: white; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">
                            Explore Events Now →
                        </a>
                    </div>
                    <p style="color: #9ca3af; font-size: 13px; text-align: center;">
                        You can unsubscribe at any time by replying to this email.
                    </p>
                </div>
                <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                    <p>© 2024 BookMyEvent. All rights reserved.</p>
                </div>
            </div>
            `,
        });
        console.log("NEWSLETTER EMAIL SENT:", info.messageId);
    } catch (error) {
        console.log("NEWSLETTER EMAIL ERROR:", error);
        throw error;
    }
};

export default sendEmail;