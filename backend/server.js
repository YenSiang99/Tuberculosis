// server.js
const express = require('express');
const mongoose = require('mongoose');

// File and os package
const fs = require('fs');
const path = require('path');

// Environment package
require('dotenv').config();

const cors = require('cors');
const authRoutes = require('./routes/auth/authRoutes');
const userRoutes = require('./routes/users/userRoutes');
const imageRoutes = require('./routes/image/imageRoutes');
const videoRoutes = require('./routes/video/videoRoutes');

const mediaDir = path.join(__dirname, 'media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const app = express();
const port = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/tb_project');
app.use(express.json());
app.use(cors());

// APIs
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/videos', videoRoutes);

// media files
app.use('/media', express.static(path.join(__dirname, 'media')));

app.get('/', (req, res) => res.send('Backend is running!'));
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));