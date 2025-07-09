const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn"); 

const path = require("path");


app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const UserRoutes = require("./routes/userRoutes");
const SongRoutes = require("./routes/song");
const PlaylistRoutes = require("./routes/playlist");
const FavouriteRoutes = require("./routes/favourites");
const PaymentRoutes = require("./routes/payment");
const SubscriptionRoutes = require("./routes/subscription");
const TransactionRoutes = require("./routes/transaction");
const ReviewRoutes = require("./routes/review");


app.use("/api/v1", UserRoutes);
app.use("/api/v1", SongRoutes);
app.use("/api/v1", PlaylistRoutes);
app.use("/api/v1", FavouriteRoutes);
app.use("/api/v1", PaymentRoutes);
app.use("/api/v1", SubscriptionRoutes);
app.use("/api/v1", TransactionRoutes);
app.use("/api/v1", ReviewRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎵 Music Server running on port ${PORT}`);
});
