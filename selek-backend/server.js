import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import messagesRoute from "./routes/messages.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration

app.use(cors({
  origin: [
    "https://www.selek.site",
    "https://selek.site",
    "https://selek-frontend.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/api/messages", messagesRoute);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/test`);
});