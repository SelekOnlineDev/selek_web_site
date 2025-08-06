import express from "express";
import { v4 as uuidv4 } from "uuid";
import Message from "../models/Message.js";
import { transporter } from "../server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1. Save to MongoDB
    const newMessage = await Message.create({
      _id: uuidv4(),
      name,
      email,
      subject,
      message,
    });

    // 2. Send email
    await transporter.sendMail({
      from: `"Selek Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    });

    res.status(201).json({ message: "Message sent and saved!", data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
