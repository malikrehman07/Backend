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
router.get("/ngo-donations", verifyToken, verifyAdmin, async (req, res) => {
    try {
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const ngoId = req.user.uid;

        // Get campaigns of this NGO
        const compaigns = await Compaign.find({ uid: ngoId }).select("_id");
        const compaignIds = compaigns.map(c => c._id.toString());

        if (!compaignIds.length) {
            return res.json([]); // No campaigns → no donations
        }

        // Get donations for those campaigns
        const donations = await Donation.find({
            "compaign.compaignId": { $in: compaignIds }
        });

        res.json({ donations });
    } catch (err) {
        console.error("Error in /dashboard/ngo-donations:", err);
        res.status(500).json({ error: "Server error", details: err.message });
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