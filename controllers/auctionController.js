// controllers/auctionController.js
const AuctionItem = require("../models/AuctionItem");
const Bid = require("../models/Bid");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to extract and verify JWT token
const getUserIdFromToken = (authorizationHeader) => {
	if (!authorizationHeader) throw new Error("No token provided");

	const token = authorizationHeader.split(" ")[1];
	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	return decodedToken.id;
};

const createAuctionItem = async (req, res) => {
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		const newDate = new Date(endDate); // Ensures proper date conversion
		const auctionItem = await AuctionItem.create({
			title,
			description,
			startingBid,
			endDate: newDate,
			createdBy: userId,
		});

		res.status(201).json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItems = async (req, res) => {
	try {
		const auctionItems = await AuctionItem.find();
		res.status(200).json(auctionItems);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItemById = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}
		res.status(200).json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItemsByUser = async (req, res) => {
	try {
		const userId = getUserIdFromToken(req.headers.authorization);
		const auctionItems = await AuctionItem.find({ createdBy: userId });
		res.status(200).json({ auctionItems });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateAuctionItem = async (req, res) => {
	const { id } = req.params;
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (title) auctionItem.title = title;
		if (description) auctionItem.description = description;
		if (startingBid) auctionItem.startingBid = startingBid;
		if (endDate) auctionItem.endDate = new Date(endDate);
		auctionItem.updatedAt = new Date();

		await auctionItem.save();

		res.json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteAuctionItem = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		await Bid.deleteMany({ auctionItemId: id }); // Use deleteMany instead of remove

		await auctionItem.deleteOne(); // Use deleteOne instead of remove

		res.json({ message: "Auction item removed" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionWinner = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res.status(404).json({ winner: "", message: "Auction item not found" });
		}

		if (new Date(auctionItem.endDate) > new Date()) {
			return res.status(400).json({ winner: "", message: "Auction has not ended yet" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		if (bids.length === 0) {
			return res.status(200).json({ winner: "", message: "No bids found" });
		}

		const highestBid = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);

		const winner = await User.findById(highestBid.userId);
		if (!winner) {
			return res.status(404).json({ winner: "", message: "Winner not found" });
		}

		res.status(200).json({ winner });
	} catch (error) {
		console.error("Error fetching auction winner:", error);
		res.status(500).json({ message: error.message });
	}
};

const getAuctionsWonByUser = async (req, res) => {
	try {
		const userId = getUserIdFromToken(req.headers.authorization);

		const bidsByUser = await Bid.find({ userId });
		const auctionIds = bidsByUser.map((bid) => bid.auctionItemId);

		const uniqueAuctionIds = [...new Set(auctionIds)];

		const wonAuctions = await Promise.all(uniqueAuctionIds.map(async (auctionItemId) => {
			const bids = await Bid.find({ auctionItemId });
			const winningBid = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);

			const auctionItem = await AuctionItem.findById(auctionItemId);
			const isAuctionEnded = new Date(auctionItem.endDate) <= new Date();

			if (isAuctionEnded && winningBid.userId.toString() === userId) {
				return {
					auctionId: auctionItemId,
					title: auctionItem.title,
					description: auctionItem.description,
					winningBid: winningBid.bidAmount,
					endDate: auctionItem.endDate,
				};
			}
			return null;
		}));

		res.status(200).json({ wonAuctions: wonAuctions.filter((auction) => auction !== null) });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createAuctionItem,
	getAuctionItems,
	updateAuctionItem,
	deleteAuctionItem,
	getAuctionItemById,
	getAuctionItemsByUser,
	getAuctionWinner,
	getAuctionsWonByUser,
};
