const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { authenticateToken } = require("./userAuth");

const Song = require("../models/song");
const User = require("../models/user");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post(
  "/add-song",
  authenticateToken,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

      const { title, artist, album, genre, duration, releaseDate, rating } = req.body;
      if (!title || !artist || !genre || !duration || !req.files?.audio) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const audioUrl = `/uploads/${req.files.audio[0].filename}`;
      const coverImage = req.files.coverImage
        ? `/uploads/${req.files.coverImage[0].filename}`
        : null;

      const newSong = new Song({
        title,
        artist,
        album,
        genre,
        duration,
        releaseDate,
        rating,
        audioUrl,
        coverImage,
        uploadedBy: user._id,
      });

      await newSong.save();
      res.status(201).json({ message: "Song added successfully", song: newSong });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error while uploading song" });
    }
  }
);




// Alternative add song endpoint for array of songs (without file uploads)
router.post("/add-songs", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    const songs = req.body;
    if (!Array.isArray(songs)) return res.status(400).json({ message: "Request body must be an array of songs" });

    const savedSongs = await Song.insertMany(songs.map(song => ({
      ...song,
      uploadedBy: {
        username: user.username,
        userId: id
      }
    })));

    if (savedSongs.length === 0) return res.status(400).json({ message: "No songs were added" });
    res.status(200).json({ message: "Songs added successfully", songs: savedSongs });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Update song
router.put("/update-song", authenticateToken, async (req, res) => {
  try {
    const { songid } = req.headers;
    await Song.findByIdAndUpdate(songid, req.body);
    return res.status(200).json({ message: "Song updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Delete song
router.delete("/delete-song", authenticateToken, async (req, res) => {
  try {
    const { songid } = req.headers;
    await Song.findByIdAndDelete(songid);
    return res.status(200).json({ message: "Song deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Delete all songs
router.delete("/delete-all-songs", authenticateToken, async (req, res) => {
  try {
    await Song.deleteMany({});
    return res.status(200).json({ message: "All songs deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
});

// Get all songs
router.get("/get-all-songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    return res.json({ status: "Success", data: songs });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get recent songs
router.get("/get-recent-songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }).limit(4);
    return res.json({ status: "Success", data: songs });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get song by ID
router.get("/get-song-by-id/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    return res.json({ status: "Success", data: song });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Search songs
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const songs = await Song.find({ title: { $regex: query, $options: "i" } });
    if (songs.length === 0) return res.status(404).json({ message: "No songs found" });

    res.status(200).json({ status: "Success", songs });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get total songs count
router.get("/total-songs", async (req, res) => {
  try {
    const count = await Song.countDocuments();
    return res.json({ status: "Success", count });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: "An error occurred" });
  }
});

// Record song play
router.post("/play/:songId", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    const { songId } = req.params;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    song.plays += 1;
    await song.save();

    const newHistory = new History({
      user: userId,
      song: songId
    });
    await newHistory.save();

    res.status(200).json({ message: "Song play recorded", song });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// Get user history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    const history = await History.find({ user: userId })
      .populate("song")
      .sort({ playedAt: -1 });
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;