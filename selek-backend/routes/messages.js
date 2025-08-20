import express from "express";
import { v4 as uuidv4 } from "uuid";
import Message from "../models/Message.js";
import transporter from "../config/emailConfig.js";
import mongoose from "mongoose";

const router = express.Router();

// POST endpoint for sending messages

router.post("/", async (req, res) => {
  console.log('MESSAGE POST REQUEST START');
 
  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { name, email, subject, message } = req.body;
    console.log('Extracted fields:', { 
      name: name ? `"${name}" (${name.length} chars)` : 'MISSING', 
      email: email ? `"${email}" (${email.length} chars)` : 'MISSING', 
      subject: subject ? `"${subject}" (${subject.length} chars)` : 'MISSING', 
      message: message ? `"${message}" (${message.length} chars)` : 'MISSING' 
    });

    // Check required fields
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "All fields are required",
        received: { name: !!name, email: !!email, subject: !!subject, message: !!message }
      });
    }

    // Additional validation for empty strings

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return res.status(400).json({
        error: "All fields must contain text",
        received: { 
          name: name.trim().length > 0, 
          email: email.trim().length > 0, 
          subject: subject.trim().length > 0, 
          message: message.trim().length > 0 
        }
      });
    }

    // Save to MongoDB

    const messageId = uuidv4();
    const newMessage = await Message.create({
      _id: messageId,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send email

    const emailResult = await transporter.sendMail({
      from: `"Selek Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}: ${subject}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
       
        Sent at: ${new Date().toISOString()}
      `,
    });

    const responseData = {
      success: true,
      message: "Message sent and saved successfully!",
      data: {
        id: newMessage._id,
        timestamp: newMessage.createdAt
      }
    };

    res.status(201).json(responseData);

  } catch (err) {
    console.error("ERROR IN MESSAGE ROUTE");
   
    // Handle specific error types

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation error",
        details: err.message,
        fields: Object.keys(err.errors || {})
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Duplicate entry",
        details: "Message with this ID already exists"
      });
    }

    if (err.responseCode) {
      return res.status(500).json({
        error: "Email sending failed",
        details: err.message
      });
    }

    // Generic server error

    res.status(500).json({
      error: "Internal server error",
      message: err.message,
      timestamp: new Date().toISOString()
    });

  } finally {
    console.log('MESSAGE POST REQUEST END');
  }
});

router.get("/", (req, res) => {
  res.json({
    message: "Messages endpoint is working",
    timestamp: new Date().toISOString(),
    methods: ["GET", "POST"]
  });
});

export default router;