const express = require('express');
const Playlist = require('../models/Playlist');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
  try {
    const playlist = new Playlist({
      name: req.body.name,
      user: req.user.userId,
      songs: req.body.songId ? [req.body.songId] : []
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create playlist' });
  }
});


router.get('/', verifyToken, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.userId }).populate('songs');
    res.json(playlists);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch playlists' });
  }
});


router.get('/:id', verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('songs');
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch playlist' });
  }
});


router.put('/:id/add', verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $addToSet: { songs: req.body.songId } },
      { new: true }
    ).populate('songs');
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add song to playlist' });
  }
});


router.put('/:id/remove', verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $pull: { songs: req.body.songId } },
      { new: true }
    ).populate('songs');
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove song from playlist' });
  }
});


router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Playlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    res.json({ message: 'Playlist deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete playlist' });
  }
});

module.exports = router;