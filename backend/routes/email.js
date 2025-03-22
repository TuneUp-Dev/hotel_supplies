const express = require("express");
const { sendEmail, validateEmail } = require("../utils/email");

const router = express.Router();

// Route for contact form submission
router.post("/send-mail", async (req, res) => {
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
router.post("/send-newsletter", async (req, res) => {
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

module.exports = router;
