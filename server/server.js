// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware: allows Express to understand JSON sent in requests
app.use(express.json());

// Middleware: allows requests from React (different port)
app.use(cors());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const compatibilityRoutes = require("./routes/compatibilityRoutes");
app.use("/api/compatibility", compatibilityRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/api/wishlist", wishlistRoutes);

const buildRoutes = require("./routes/buildRoutes");
app.use("/api/builds", buildRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});