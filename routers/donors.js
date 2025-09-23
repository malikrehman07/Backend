const express = require('express');
const router = express.Router();
const Donation = require('../models/donations');
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
        const ngoId = req.user.uid;

        // First get all campaign IDs of this NGO
        const compaigns = await Compaign.find({ uid: ngoId }).select("_id");
        const compaignIds = compaigns.map(c => c._id);

        // Then get donations for those campaigns
        const donations = await Donation.find({ compaignId: { $in: compaignIds } })

        res.status(200).json({ message: "donation fetched successfully", isError: false, donations });
    } catch (err) {
        console.error("Delete donation error:", err.message);
        res.status(500).json({ message: "Error fetching donation", error: err.message, isError: true });
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