import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("[emailConfig] EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "[emailConfig] EMAIL_PASS:",
  process.env.EMAIL_PASS ? "EXISTS" : "MISSING"
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("[emailConfig] Transporter verification failed:", error);
  } else {
    console.log("[emailConfig] Transporter is ready to send emails");
  }
});

export default transporter;