// GET /compaigns/search?query=health
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query is required", isError: true });
        }

        // Case-insensitive regex search for title or category
        const compaigns = await Compaign.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({ message: "Search results", compaigns, isError: false });
    } catch (error) {
        res.status(500).json({ message: "Search failed", error: error.message, isError: true });
    }
});
