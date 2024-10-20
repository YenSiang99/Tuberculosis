const express = require("express");
const mongoose = require("mongoose");

// File and os package
const fs = require("fs");
const path = require("path");

// Environment package
// require("dotenv").config();

console.log(`Current Environment: ${process.env.NODE_ENV}`);

// Determine the current environment; default to 'development'
const env = process.env.NODE_ENV || "development";

// Construct the path to the corresponding .env file
const envFilePath = path.resolve(__dirname, `.env.${env}`);

// Load the appropriate .env file
if (fs.existsSync(envFilePath)) {
  require("dotenv").config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}`);
} else {
  console.warn(
    `Environment file ${envFilePath} not found. Falling back to default .env`
  );
  require("dotenv").config(); // Loads .env as a fallback
}

const cors = require("cors");
const authRoutes = require("./routes/auth/authRoutes");
const userRoutes = require("./routes/users/userRoutes");
const videoRoutes = require("./routes/video/videoRoutes");
const sideEffectRoutes = require("./routes/sideEffect/sideEffectRoutes");
const appointmentRoutes = require("./routes/appointment/appointmentRoutes");
const progressTrackerRoutes = require("./routes/progressTracker/progressTrackerRoutes");
const notificationRoutes = require("./routes/notification/notificationRoutes");

// Admin games routes
const wordListRoutes = require("./routes/games/wordListRoutes");
const quizRoutes = require("./routes/games/quizRoutes");
const storyRoutes = require("./routes/games/storyRoutes");
const fillBlankRoutes = require("./routes/games/fillBlankRoutes");

// Scoring routes
const wordSearchScoreRoutes = require("./routes/score/wordSearchScoreRoutes");
const quizScoreRoutes = require("./routes/score/quizScoreRoutes");
const storyScoreRoutes = require("./routes/score/storyScoreRoutes");
const fillBlankScoreRoutes = require("./routes/score/fillBlankScoreRoutes");

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

mongoose.connect(process.env.MONGO_URL);

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

app.use("/api/score/wordsearch", wordSearchScoreRoutes);
app.use("/api/score/quizzes", quizScoreRoutes);
app.use("/api/score/stories", storyScoreRoutes);
app.use("/api/score/fillblank", fillBlankScoreRoutes);

// media files
app.use("/media", express.static(path.join(__dirname, "media")));

app.get("/", (req, res) => res.send("Backend is running!"));
app.listen(port, () =>
  console.log(`Server listening at ${process.env.BASE_URL}`)
);
