//server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tb_project', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

