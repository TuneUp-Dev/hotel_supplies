const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/products");
const subcategoriesRoutes = require("./routes/subcategories");
const categoriesRoutes = require("./routes/categories");
const uploadRoutes = require("./routes/upload");
const bulkRoutes = require("./routes/bulk");
const enquiryRoutes = require("./routes/enquiry");
const corsConfig = require("./config/cors");

dotenv.config();

// Middleware
const app = express();
app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/subcategories", subcategoriesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/", enquiryRoutes);

// Server PORT
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
