const express = require('express');
const router = express.Router();
const Donation = require('../models/donations');
const Compaign = require('../models/compaign');
const { verifyToken, verifyAdmin, verifyCustomer } = require('../middleware/auth');

router.get("/donations", async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "donations fetched", donations, isError: false });
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations", error: error.message, isError: true });
    }
});

// ✅ Get Orders by User ID
router.get("/my-donations", verifyToken, verifyCustomer, async (req, res) => {
    try {
        const donations = await Donation.find({ uid: req.uid }).sort({ createdAt: -1 });
        res.status(200).json({ donations });
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ message: "Failed to fetch donations" });
    }
});

// Get donations for logged-in NGO’s campaigns
// GET donations for my NGO's compaigns
router.get("/ngo-donations", verifyToken, async (req, res) => {
    try {
        // Make sure only NGOs can access
        if (req.role !== "NGO") {
            return res.status(403).json({ message: "Access denied: NGO only" });
        }

        // Step 1: Find all compaigns created by this NGO
        const myCompaigns = await Compaign.find({ uid: req.uid }).select("_id");

        // Step 2: Extract their IDs
        const compaignIds = myCompaigns.map(c => c._id);

        // Step 3: Find donations where compaignId is in my compaigns
        const donations = await Donation.find({ compaignId: { $in: compaignIds } })
            .populate("compaign", "title image") // populate compaign details
            .sort({ createdAt: -1 });

        res.status(200).json({ donations });
    } catch (error) {
        console.error("Error fetching NGO donations:", error);
        res.status(500).json({ message: "Failed to fetch donations" });
    }
});





// ✅ DELETE ORDER BY ID (Admin Only)
router.delete("/delete/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const deleted = await Donation.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "donation not found", isError: true });
        }

        res.status(200).json({ message: "donation deleted successfully", isError: false });
    } catch (error) {
        console.error("Delete donation error:", error.message);
        res.status(500).json({ message: "Error deleting donation", error: error.message, isError: true });
    }
});


module.exports = router