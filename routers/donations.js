const express = require('express');
const router = express.Router();
const Donation = require('../models/donations');

// POST /order/submit
// POST /checkout
router.post('/checkout', async (req, res) => {
    try {
        const donationData = req.body;

        // optional: validate required fields
        if (!donationData?.uid || !donationData?.amount || !donationData?.compaign) {
            return res.status(400).json({ message: "Missing required donation data" });
        }

        const newDonation = new Donation(donationData);
        await newDonation.save();

        res.status(201).json({ message: "donation placed successfully", donation: newDonation });
    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ message: "Failed to place donation", error: error.message });
    }
});

router.get('/compaign/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const donations = await Donation.find({ "compaign.compaignId": id });

        res.status(200).json({ donations });
    } catch (error) {
        console.error("Error fetching donations by compaign:", error);
        res.status(500).json({ message: "Failed to fetch donations", error: error.message });
    }
});


module.exports = router;
