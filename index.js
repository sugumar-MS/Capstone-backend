// index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// CORS configuration
app.use(cors({
	origin: process.env.ORIGIN || 'http://localhost:5173', // Use the origin from environment variables or default to localhost
	methods: ["GET", "PUT", "POST", "DELETE"],
	credentials: true, // Allow credentials like cookies
}));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
