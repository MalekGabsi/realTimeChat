import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
console.log("JWT Secret:", process.env.JWT_SECRET);
// Load environment variables
dotenv.config();

// Fix __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Debugging: Check if MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
} else {
  console.log("✅ Mongo URI Loaded:", process.env.MONGO_URI);
}

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);



// Start server
server.listen(PORT, async () => {
  try {
    await connectToMongoDB(); // Ensure MongoDB connection before running the server
    console.log(`🚀 Server Running on port ${PORT}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
});
