const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const { verifyToken, verifyCustomer, verifyAdmin } = require("../middleware/auth");
// Read NGO Profile 
router.get("/read-profile", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ngo = await User.findOne({ uid: req.uid, role: "NGO" }).select("-password");
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json({ user: ngo });
    } catch (error) {
        console.error("Error fetching NGO profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ UPDATE NGO Profile
router.put("/update-profile", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const updated = await User.findOneAndUpdate(
            { uid: req.uid, role: "NGO" },
            req.body,
            { new: true }
        ).select("-password");

        if (!updated) {
            return res.status(404).json({ message: "NGO not found" });
        }

        res.status(200).json({ message: "Profile updated", user: updated });
    } catch (error) {
        console.error("Error updating ngo profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ DELETE NGO Profile
router.delete("/delete-profile", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const deleted = await User.findOneAndDelete({ uid: req.uid, role: "NGO" });
        if (!deleted) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json({ message: "NGO profile deleted" });
    } catch (error) {
        console.error("Error deleting NGO profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
