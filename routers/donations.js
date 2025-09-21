const express = require('express');
const router = express.Router();
const Donation = require('../models/donations');

// POST /order/submit
// POST /checkout
router.post('/checkout', async (req, res) => {
    try {
        const donationData = req.body;

        // optional: validate required fields
        if (!donationData?.uid || !donationData?.cart?.length) {
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


module.exports = router;
