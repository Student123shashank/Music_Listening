const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


favoriteSchema.index({ user: 1, song: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);