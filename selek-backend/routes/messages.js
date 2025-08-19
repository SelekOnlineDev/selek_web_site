import express from "express";
import { v4 as uuidv4 } from "uuid";
import Message from "../models/Message.js";
import transporter from "../config/emailConfig.js";
import mongoose from "mongoose";

const router = express.Router();

// POST endpoint for sending messages
router.post("/", async (req, res) => {
  console.log('MESSAGE POST REQUEST START');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));
 
  try {
    // Validate request body
    if (!req.body) {
      console.error('Request body is missing');
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
      console.error('Missing required fields');
      return res.status(400).json({
        error: "All fields are required",
        received: { name: !!name, email: !!email, subject: !!subject, message: !!message }
      });
    }

    // Additional validation for empty strings
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      console.error('Empty fields detected');
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

    console.log('All fields validated successfully');

    // Save to MongoDB
    console.log('Saving to MongoDB...');
    const messageId = uuidv4();
    const newMessage = await Message.create({
      _id: messageId,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    console.log('Message saved to MongoDB:', newMessage._id);

    // Send email
    console.log('Preparing to send email...');
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
   
    console.log('Email sent successfully:', emailResult.messageId);

    const responseData = {
      success: true,
      message: "Message sent and saved successfully!",
      data: {
        id: newMessage._id,
        timestamp: newMessage.createdAt
      }
    };

    console.log('Sending success response:', responseData);
    res.status(201).json(responseData);

  } catch (err) {
    console.error("ERROR IN MESSAGE ROUTE");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Stack trace:", err.stack);
   
    // Handle specific error types
    if (err.name === 'ValidationError') {
      console.error("MongoDB validation error details:", err.errors);
      return res.status(400).json({
        error: "Validation error",
        details: err.message,
        fields: Object.keys(err.errors || {})
      });
    }

    if (err.code === 11000) {
      console.error("MongoDB duplicate key error");
      return res.status(400).json({
        error: "Duplicate entry",
        details: "Message with this ID already exists"
      });
    }

    if (err.responseCode) {
      console.error("Email error code:", err.responseCode);
      console.error("Email error response:", err.response);
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

// GET endpoint for testing
router.get("/", (req, res) => {
  console.log('GET /api/messages endpoint called');
  res.json({
    message: "Messages endpoint is working",
    timestamp: new Date().toISOString(),
    methods: ["GET", "POST"]
  });
});

export default router;