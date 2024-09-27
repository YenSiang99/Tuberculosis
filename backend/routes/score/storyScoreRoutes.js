// routes/games/interactiveStoryRoutes.js
const express = require("express");
const StoryScoreController = require("../../controllers/score/StoryScoreController");

const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");

const router = express.Router();

// Submit a new score for interactive story
router.post("/submit", authenticate, StoryScoreController.submitStoryScore);

// Get user's own scores for interactive story
router.get("/my-scores", authenticate, StoryScoreController.getUserStoryScores);

// Admin: Get all scores for interactive story
router.get(
  "/all-scores",
  authenticate,
  authorize("admin"),
  StoryScoreController.getAllStoryScores
);

module.exports = router;
