const express = require('express');
const multer = require('multer');
const path = require('path');
const Song = require('../models/Song');
const { verifyAdmin, verifyToken } = require('../middleware/auth');
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/songs');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });


router.post('/add', verifyAdmin, upload.single('audio'), async (req, res) => {
  const { name, artist, imageUrl } = req.body;
  const audioUrl = `/uploads/songs/${req.file.filename}`;
  try {
    const song = new Song({ name, artist, imageUrl, audioUrl, uploadedBy: req.user.userId });
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload song' });
  }
});


router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
});


router.get('/', verifyToken, async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

module.exports = router;
