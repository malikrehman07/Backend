const express = require('express')
const router = express.Router()
const Compaign = require("../models/compaign")
require('dotenv').config()
const { verifyToken, verifyAdmin } = require('../middleware/auth')

router.post('/add', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const compaignData = { ...req.body }
        const newCompaign = new Compaign(compaignData)
        await newCompaign.save()
        res.status(201).json({ message: "Compaign created successfully", isError: false, compaign: newCompaign })
    } catch (err) {
        res.status(500).json({ message: "Failed to create product", error: err.message, isError: true });
        console.error("❌ Product creation failed:", err);
    }
});
router.get("/read", async (req, res) => {
    try {
        const compaigns = await Compaign.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Products fetched successfully", compaigns, isError: false });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error: error.message, isError: true });
    }
});
router.get("/read/:id", async (req, res) => {
    try {
        const compaign = await Compaign.findById(req.params.id); // ✅ FIXED
        if (!compaign) return res.status(404).json({ message: "compaign not found", isError: true });
        res.status(200).json({ message: "compaign fetched successfully", compaign, isError: false });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message, isError: true });
    }
});

// ✅ UPDATE PRODUCT BY _id (Admin Only)
router.put("/update/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const updated = await Compaign.findByIdAndUpdate(req.params.id, req.body, { new: true }); // ✅ FIXED
        if (!updated) return res.status(404).json({ message: "Compaign not found", isError: true });
        res.status(200).json({ message: "Compaign updated successfully", compaign: updated, isError: false });
    } catch (error) {
        res.status(500).json({ message: "Error updating compaign", error: error.message, isError: true });
    }
});

// ✅ DELETE PRODUCT BY _id (Admin Only)
router.delete("/delete/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const deleted = await Compaign.findByIdAndDelete(req.params.id); // ✅ FIXED
        if (!deleted) return res.status(404).json({ message: "Compaign not found", isError: true });
        res.status(200).json({ message: "Compaign deleted successfully", isError: false });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message, isError: true });
    }
});

module.exports = router;