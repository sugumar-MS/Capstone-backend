//index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.ORIGIN || "https://capstone-frontend-auction.netlify.app", // Allow requests from Netlify
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies or auth tokens
};

app.use(cors(corsOptions));

// Allow preflight requests for all routes
app.options('*', cors(corsOptions));

// Define routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));

// Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
