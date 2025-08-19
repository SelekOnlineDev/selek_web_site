import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Užtikrina, kad .env kintamieji būtų įkelti

console.log("[emailConfig] EMAIL_USER:", process.env.EMAIL_USER);
console.log("[emailConfig] EMAIL_PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Patikrinkime transporterio galimybes
transporter.verify((error, success) => {
  if (error) {
    console.error("[emailConfig] Transporter verification failed:", error);
  } else {
    console.log("[emailConfig] Transporter is ready to send emails");
  }
});

export default transporter;