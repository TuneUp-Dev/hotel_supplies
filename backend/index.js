const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/products");
const emailRoutes = require("./routes/email");
const enquiryRoutes = require("./routes/enquiry");
const corsConfig = require("./config/cors");

dotenv.config();

// Middleware
const app = express();
app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/send-mail", emailRoutes);
app.use("/send-newsletter", emailRoutes);
app.use("/", enquiryRoutes);

// Start the server

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
