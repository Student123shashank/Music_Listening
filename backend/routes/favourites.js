const router = require("express").Router();
const User = require("../models/user");
const Song = require("../models/song");
const { authenticateToken } = require("./userAuth");


router.put("/add-song-to-favourites", authenticateToken, async (req, res) => {
    try {
        const { songid, id } = req.headers;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAlreadyFavourite = user.favourites.includes(songid);

        if (isAlreadyFavourite) {
            return res.status(200).json({ message: "Song is already in favourites" });
        }

        await User.findByIdAndUpdate(id, { $push: { favourites: songid } });
        return res.status(200).json({ message: "Song added to favourites" });
    } catch (error) {
        console.error("Error adding song to favourites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/remove-song-from-favourites", authenticateToken, async (req, res) => {
    try {
        const { songid, id } = req.headers;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFavourite = user.favourites.includes(songid);

        if (isFavourite) {
            await User.findByIdAndUpdate(id, { $pull: { favourites: songid } });
            return res.status(200).json({ message: "Song removed from favourites" });
        } else {
            return res.status(400).json({ message: "Song not found in favourites" });
        }
    } catch (error) {
        console.error("Error removing song from favourites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/get-favourite-songs", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id).populate("favourites");
        return res.status(200).json({ status: "Success", data: user.favourites });
    } catch (error) {
        console.error("Error getting favourite songs:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
