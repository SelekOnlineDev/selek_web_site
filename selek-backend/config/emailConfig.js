import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "[emailConfig] RESEND_API_KEY:",
  process.env.RESEND_API_KEY ? "EXISTS" : "MISSING"
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;