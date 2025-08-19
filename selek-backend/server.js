import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import messagesRoute from "./routes/messages.js";

const app = express();

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// JSON parseris - TURI BŪTI PIRMAS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://selek.site",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// Test endpoint
app.get("/api/test", (req, res) => {
  console.log('Test endpoint called');
  res.json({
    status: "working",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development"
  });
});

// MongoDB prisijungimas
const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Maršrutai
app.use("/api/messages", messagesRoute);

// Serverio paleidimas
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/test`);
});