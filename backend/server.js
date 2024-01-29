// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth/authRoutes');
const userRoutes = require('./routes/users/userRoutes');
const imageRoutes = require('./routes/image/imageRoutes');

const app = express();
const port = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/tb_project');
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

app.get('/', (req, res) => res.send('Backend is running!'));
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));