import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import bookmarkRoutes from "./src/routes/bookmarkRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import newsletterRoutes from "./src/routes/newsletterRoutes.js";

connectDB();

const app = express();

app.use(cors({ origin: ["http://localhost:5173","https://book-my-events-tau.vercel.app/"], credentials: true, }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/newsletter", newsletterRoutes);


app.get("/", (req, res) => {
    res.send("BookMyEvent API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});