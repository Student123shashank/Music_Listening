const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "playlist" }],
    recentlyPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }]
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
