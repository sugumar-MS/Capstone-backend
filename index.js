//index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5174', // For local development
  'https://capstone-frontend-task.netlify.app' // For production
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

