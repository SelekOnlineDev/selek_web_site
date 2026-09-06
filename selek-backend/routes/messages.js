import express from "express";
import { v4 as uuidv4 } from "uuid";
import Message from "../models/Message.js";
import resend from "../config/emailConfig.js";

const router = express.Router();

// POST endpoint for sending messages
router.post("/", async (req, res) => {
  console.log("MESSAGE POST REQUEST START");

  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({
        error: "Request body is missing",
      });
    }

    const { name, email, subject, message } = req.body;

    console.log("Extracted fields:", {
      name: name ? `"${name}" (${name.length} chars)` : "MISSING",
      email: email ? `"${email}" (${email.length} chars)` : "MISSING",
      subject: subject ? `"${subject}" (${subject.length} chars)` : "MISSING",
      message: message
        ? `"${message}" (${message.length} chars)`
        : "MISSING",
    });

    // Check required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "All fields are required",
        received: {
          name: !!name,
          email: !!email,
          subject: !!subject,
          message: !!message,
        },
      });
    }

    // Check for empty strings
    if (
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "All fields must contain text",
      });
    }

    // Save message to MongoDB
    const messageId = uuidv4();

    const newMessage = await Message.create({
      _id: messageId,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    console.log("Message saved to MongoDB:", newMessage._id);

    // Send email using Resend API
    const { data, error } = await resend.emails.send({
      from: "Selek Contact <onboarding@resend.dev>",
      to: [process.env.EMAIL_USER],
      replyTo: email.trim(),
      subject: `New message from ${name.trim()}: ${subject.trim()}`,
      html: `
        <h3>New Contact Form Message</h3>

        <p>
          <strong>From:</strong> ${name.trim()}
        </p>

        <p>
          <strong>Email:</strong> ${email.trim()}
        </p>

        <p>
          <strong>Subject:</strong> ${subject.trim()}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <p>
          ${message.trim().replace(/\n/g, "<br>")}
        </p>

        <hr>

        <p>
          <small>
            Sent at: ${new Date().toISOString()}
          </small>
        </p>
      `,
      text: `
Name: ${name.trim()}

Email: ${email.trim()}

Subject: ${subject.trim()}

Message:
${message.trim()}

Sent at: ${new Date().toISOString()}
      `,
    });

    if (error) {
      console.error("RESEND EMAIL ERROR:", error);

      return res.status(500).json({
        error: "Email sending failed",
        details: error.message || "Unknown Resend error",
      });
    }

    console.log("Email sent successfully:", data?.id);

    return res.status(201).json({
      success: true,
      message: "Message sent and saved successfully!",
      data: {
        id: newMessage._id,
        emailId: data?.id || null,
        timestamp: newMessage.createdAt,
      },
    });

  } catch (err) {
    console.error("ERROR IN MESSAGE ROUTE:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: err.message,
        fields: Object.keys(err.errors || {}),
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Duplicate entry",
        details: "Message with this ID already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
      timestamp: new Date().toISOString(),
    });

  } finally {
    console.log("MESSAGE POST REQUEST END");
  }
});

// GET endpoint
router.get("/", (req, res) => {
  res.json({
    message: "Messages endpoint is working",
    timestamp: new Date().toISOString(),
    methods: ["GET", "POST"],
  });
});

export default router;