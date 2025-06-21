import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is running on Vercel (API Only)"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDB().catch(err => console.error("Database connection failed on Vercel:", err));

export default app; // CRITICAL: Export the Express app instance for Vercel