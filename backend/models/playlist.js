const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String, default: "https://cdn-icons-png.flaticon.com/512/727/727245.png" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "songs" }],
  isPublic: { type: Boolean, default: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
}, { timestamps: true });

module.exports = mongoose.model("playlist", playlistSchema);
