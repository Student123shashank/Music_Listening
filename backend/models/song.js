const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  audioUrl: { type: String, required: true },
  coverImage: { type: String },
  releaseDate: { type: Date },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  plays: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "reviews" }],
}, { timestamps: true });

module.exports = mongoose.model("songs", songSchema);
