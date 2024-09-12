//index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
	origin: process.env.ORIGIN || "http://localhost:5173", // Default to localhost if not set
	methods: ["GET", "PUT", "POST", "DELETE"],
	credentials: true,
};

app.use(cors(corsOptions));

// Define routes
const router = express.Router();
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));

// Root route (for testing purposes)
router.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
