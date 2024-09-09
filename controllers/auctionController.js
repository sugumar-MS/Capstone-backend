// controllers/auctionController.js
const AuctionItem = require("../models/AuctionItem");
const Bid = require("../models/Bid");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createAuctionItem = async (req, res) => {
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		const newDate = new Date(new Date(endDate).getTime());
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
		const token = req.headers.authorization.split(" ")[1];
		const { id } = jwt.decode(token, process.env.JWT_SECRET, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: err.message });
			}
		});
		const auctionItems = await AuctionItem.find({ createdBy: id });
		res.status(200).json({
			auctionItems,
		});
	} catch (error) {
		console.log(error.message);
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

		// Update fields if they are provided in the request body
		auctionItem.title = title || auctionItem.title;
		auctionItem.description = description || auctionItem.description;
		auctionItem.startingBid = startingBid || auctionItem.startingBid;
		auctionItem.endDate = endDate
			? new Date(endDate)  // Converts to Date object
			: auctionItem.endDate;

		auctionItem.updatedAt = new Date(); // Automatically update the update timestamp
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

        // Remove all bids associated with this auction item
        await Bid.deleteMany({ auctionItemId: id });

        // Delete the auction item
        await AuctionItem.deleteOne({ _id: id });

        res.json({ message: "Auction item removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAuctionWinner = async (req, res) => {
	const { id } = req.params;
	try {
	  // Find the auction item by ID
	  const auctionItem = await AuctionItem.findById(id);
	  if (!auctionItem) {
		return res.status(404).json({ winner: null, message: "Auction item not found" });
	  }
  
	  // Check if the auction has ended
	  const currentDate = new Date();
	  const auctionEndDate = new Date(auctionItem.endDate);
	  if (auctionEndDate > currentDate) {
		return res.status(200).json({ winner: null, message: "Auction has not ended yet" });
	  }
  
	  // Fetch all bids for the auction item
	  const bids = await Bid.find({ auctionItemId: id });
	  if (bids.length === 0) {
		return res.status(200).json({ winner: null, message: "No bids found" });
	  }
  
	  // Find the highest bid
	  const highestBid = bids.reduce((max, bid) => {
		return bid.bidAmount > max.bidAmount ? bid : max;
	  }, bids[0]);
  
	  // Find the user who made the highest bid
	  const winner = await User.findById(highestBid.userId);
	  if (!winner) {
		return res.status(404).json({ winner: null, message: "Winner not found" });
	  }
  
	  // Return the winner information
	  res.status(200).json({ winner, message: "Auction has ended. Winner found." });
	} catch (error) {
	  console.error("Error fetching auction winner:", error);
	  res.status(500).json({ message: "Internal Server Error" });
	}
  };
  

const getAuctionsWonByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const { id } = decodedToken;

		const bidsByUser = await Bid.find({ userId: id });
		const auctionIds = bidsByUser.map((bid) => bid.auctionItemId);

		const uniqueAuctionIds = [...new Set(auctionIds)];

		let wonAuctions = [];

		for (let i = 0; i < uniqueAuctionIds.length; i++) {
			const auctionItemId = uniqueAuctionIds[i];
			const bids = await Bid.find({ auctionItemId });
			let winningBid = bids.reduce(
				(max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
				bids[0]
			);

			const auctionItem = await AuctionItem.findById(auctionItemId);
			const isAuctionEnded =
				new Date(auctionItem.endDate) <= new Date(Date.now());

			if (isAuctionEnded && winningBid.userId.toString() === id) {
				wonAuctions.push({
					auctionId: auctionItemId,
					title: auctionItem.title,
					description: auctionItem.description,
					winningBid: winningBid.bidAmount,
					endDate: auctionItem.endDate,
				});
			}
		}
		res.status(200).json({ wonAuctions });
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