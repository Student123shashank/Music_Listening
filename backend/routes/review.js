const router = require("express").Router();
const Review = require("../models/review");
const { authenticateToken } = require("./userAuth");

// ✅ Add a new review
router.post("/add",  async (req, res) => {
    try {
        const { userId, songId, playlistId, rating, comment } = req.body;

        if (!songId && !playlistId) {
            return res.status(400).json({ message: "Song or Playlist ID is required" });
        }

        const newReview = new Review({
            user: userId,
            song: songId || null,
            playlist: playlistId || null,
            rating,
            comment
        });

        const saved = await newReview.save();
        res.status(201).json({ message: "Review added successfully", data: saved });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Get all reviews for a song
router.get("/song/:songId", async (req, res) => {
    try {
        const reviews = await Review.find({ song: req.params.songId }).populate("user", "username email");
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching song reviews:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Get all reviews for a playlist
router.get("/playlist/:playlistId", async (req, res) => {
    try {
        const reviews = await Review.find({ playlist: req.params.playlistId }).populate("user", "username email");
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching playlist reviews:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Get all reviews by a specific user
router.get("/user/:userId", authenticateToken, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId }).populate("song playlist");
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Get all reviews (for admin panel)
router.get("/all", async (req, res) => {
    try {
        const reviews = await Review.find().populate("user", "username email").populate("song playlist");
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching all reviews:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Update a review by ID
router.put("/update/:id", authenticateToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, comment },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Review not found" });
        res.status(200).json({ message: "Review updated successfully", data: updated });
    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Delete a review by ID
router.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Review not found" });
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;