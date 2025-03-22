const express = require("express");
const { sendEmail } = require("../utils/email");

const router = express.Router();

// Endpoint to handle enquiry submission
router.post("/send-enquiry", async (req, res) => {
  const { name, email, contactNumber, message, cartItems } = req.body;

  try {
    // Format cart items into a readable list
    const cartItemsText = cartItems
      .map(
        (item) =>
          `- ${item.name} (Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity})`
      )
      .join("\n");

    // Email content for admin
    const adminEmailText = `New Enquiry Received:

    Name: ${name}
    Email: ${email}
    Contact Number: ${contactNumber}
    Message: ${message}
    
    Cart Items:
    ${cartItemsText}
    
    Please respond to the enquiry as soon as possible.`;

    // Email content for user confirmation
    const userEmailText = `Dear ${name},

    Thank you for reaching out to Hotel Supplies. We have received your enquiry and will get back to you shortly.

    Here are the details of your enquiry:
    
    Contact Number: ${contactNumber}
    Message: ${message}
    
    Your Selected Items:
    ${cartItemsText}

    Best regards,
    Hotel Supplies Team`;

    // Send email to admin
    const adminResult = await sendEmail(
      "srinisvfb1018@gmail.com",
      "New Enquiry Received - Hotel Supplies",
      adminEmailText
    );

    // Send confirmation email to user
    const userResult = await sendEmail(
      email,
      "Your Enquiry to Hotel Supplies",
      userEmailText
    );

    if (adminResult.success && userResult.success) {
      res.status(200).json({ message: "Enquiry sent successfully!" });
    } else {
      res.status(500).json({
        message: "Failed to send enquiry. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error sending enquiry email:", error);
    res.status(500).json({
      message: "Failed to send enquiry. Please try again.",
    });
  }
});

module.exports = router;
