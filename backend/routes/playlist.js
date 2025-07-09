const router = require("express").Router();
const Playlist = require("../models/playlist");
const User = require("../models/user");
const Song = require("../models/song");
const { authenticateToken } = require("./userAuth");


router.post("/create", authenticateToken, async (req, res) => {
    try {
        const { title, description, coverImage, songs, isPublic, userId } = req.body;

        const newPlaylist = new Playlist({
            title,
            description,
            coverImage,
            createdBy: userId,
            songs,
            isPublic
        });

        const savedPlaylist = await newPlaylist.save();

        
        await User.findByIdAndUpdate(userId, {
            $push: { playlists: savedPlaylist._id }
        });

        res.status(201).json({ message: "Playlist created", data: savedPlaylist });
    } catch (err) {
        console.error("Error creating playlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate("songs")
            .populate("createdBy", "username email avatar");

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.status(200).json(playlist);
    } catch (err) {
        console.error("Error fetching playlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/user/:userId", async (req, res) => {
    try {
        const playlists = await Playlist.find({ createdBy: req.params.userId }).populate("songs");
        res.status(200).json(playlists);
    } catch (err) {
        console.error("Error fetching playlists:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/update/:id", authenticateToken, async (req, res) => {
    try {
        const { title, description, coverImage, isPublic } = req.body;

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            req.params.id,
            { title, description, coverImage, isPublic },
            { new: true }
        );

        res.status(200).json({ message: "Playlist updated", data: updatedPlaylist });
    } catch (err) {
        console.error("Error updating playlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        await Playlist.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(playlist.createdBy, {
            $pull: { playlists: playlist._id }
        });

        res.status(200).json({ message: "Playlist deleted" });
    } catch (err) {
        console.error("Error deleting playlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/add-song", authenticateToken, async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: "Song already in playlist" });
        }

        playlist.songs.push(songId);
        await playlist.save();

        res.status(200).json({ message: "Song added to playlist" });
    } catch (err) {
        console.error("Error adding song:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/remove-song", authenticateToken, async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { songs: songId } },
            { new: true }
        );

        res.status(200).json({ message: "Song removed from playlist", data: playlist });
    } catch (err) {
        console.error("Error removing song:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/toggle-like", authenticateToken, async (req, res) => {
    try {
        const { playlistId, userId } = req.body;
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const isLiked = playlist.likes.includes(userId);
        if (isLiked) {
            playlist.likes.pull(userId);
            await playlist.save();
            return res.status(200).json({ message: "Playlist unliked" });
        } else {
            playlist.likes.push(userId);
            await playlist.save();
            return res.status(200).json({ message: "Playlist liked" });
        }
    } catch (err) {
        console.error("Error toggling like:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
