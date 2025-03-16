const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 5003;

app.use(express.json());

const allowedOrigins = [
  "https://hotel-supplies.vercel.app",
  "https://www.hotel-supplies.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Validate email format
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generic function to send email
const sendEmail = async (subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "info@ecococoproduct.com",
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
};

// Route for contact form submission
app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Send email
  const emailText = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
  const result = await sendEmail(
    email,
    "New Contact Form Submission",
    emailText
  );

  if (result.success) {
    res.status(200).json({ success: result.message });
  } else {
    res.status(500).json({ error: result.message });
  }
});

// Route for newsletter subscription
app.post("/send-newsletter", async (req, res) => {
  const { email } = req.body;

  // Validate required field
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Send email
  const emailText = `Email: ${email}`;
  const result = await sendEmail(
    email,
    "New Newsletter Subscription",
    emailText
  );

  if (result.success) {
    res.status(200).json({ success: result.message });
  } else {
    res.status(500).json({ error: result.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
