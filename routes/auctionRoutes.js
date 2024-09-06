// routes/auctionRoutes.js
const express = require("express");
const {
	createAuctionItem,
	getAuctionItems,
	updateAuctionItem,
	deleteAuctionItem,
	getAuctionItemById,
	getAuctionItemsByUser,
	getAuctionWinner,
	getAuctionsWonByUser,
} = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");
const authenticateUser = require("../middleware/authenticateUser");
const router = express.Router();

// Public routes
router.route("/").get(getAuctionItems);
router.get("/:id", getAuctionItemById);

// Routes requiring authentication
router.post("/", authMiddleware, authenticateUser, createAuctionItem);
router.post("/user", authMiddleware, authenticateUser, getAuctionItemsByUser);
router.get("/winner/:id", authMiddleware, authenticateUser, getAuctionWinner);
router.post("/won", authMiddleware, authenticateUser, getAuctionsWonByUser);

// Routes requiring authentication and authorization for specific actions
router
	.route("/:id")
	.put(authMiddleware, authenticateUser, updateAuctionItem)
	.delete(authMiddleware, authenticateUser, deleteAuctionItem);

module.exports = router;
