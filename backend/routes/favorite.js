const express = require('express');
const Favorite = require('../models/Favorite');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();


router.post('/:songId', verifyToken, async (req, res) => {
  try {
    const favorite = new Favorite({
      user: req.user.userId,
      song: req.params.songId
    });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to favorites' });
  }
});


router.delete('/:songId', verifyToken, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user.userId,
      song: req.params.songId
    });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove from favorites' });
  }
});


router.get('/', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.userId }).populate('song');
    res.json(favorites.map(fav => fav.song));
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch favorites' });
  }
});

module.exports = router;