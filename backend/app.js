const express = require('express');
const connectDB = require('./conn/conn');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/song');
const userRoutes = require('./routes/user');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();


app.use(cors());
app.use(express.json());
app.use('/uploads/songs', express.static(path.join(__dirname, 'uploads/songs')));


app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
