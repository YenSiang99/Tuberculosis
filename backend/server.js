// server.js
const express = require("express");
const mongoose = require("mongoose");

// File and os package
const fs = require("fs");
const path = require("path");

// Environment package
require("dotenv").config();

const cors = require("cors");
const authRoutes = require("./routes/auth/authRoutes");
const userRoutes = require("./routes/users/userRoutes");
const videoRoutes = require("./routes/video/videoRoutes");
const sideEffectRoutes = require("./routes/sideEffect/sideEffectRoutes");
const appointmentRoutes = require("./routes/appointment/appointmentRoutes");
const progressTrackerRoutes = require("./routes/progressTracker/progressTrackerRoutes");
const notificationRoutes = require("./routes/notification/notificationRoutes");
const wordListRoutes = require("./routes/games/wordListRoutes");
const quizRoutes = require("./routes/games/quizRoutes");
const storyRoutes = require("./routes/games/storyRoutes");
const fillBlankRoutes = require("./routes/games/fillBlankRoutes");

const profilesDir = path.join(__dirname, "media/profiles/");
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

const videosDir = path.join(__dirname, "media/videos/");
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const app = express();
const port = 3001;

require("./scheduler");

mongoose.connect("mongodb://127.0.0.1:27017/tb_project");
app.use(express.json());
app.use(cors());

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/sideEffects", sideEffectRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/progressTracker", progressTrackerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/wordLists", wordListRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/fillBlanks", fillBlankRoutes);

// media files
app.use("/media", express.static(path.join(__dirname, "media")));

app.get("/", (req, res) => res.send("Backend is running!"));
app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
