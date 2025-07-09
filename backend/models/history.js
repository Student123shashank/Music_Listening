const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  song: { type: mongoose.Schema.Types.ObjectId, ref: "songs", required: true },
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("history", historySchema);
