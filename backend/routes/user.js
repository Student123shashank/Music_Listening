const express = require('express');
const User = require('../models/User');
const { verifyAdmin } = require('../middleware/auth');
const router = express.Router();


router.get('/', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
