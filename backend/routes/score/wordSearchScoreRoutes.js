// routes/games/wordSearchRoutes.js
const express = require("express");
const WordSearchScoreController = require("../../controllers/score/WordSearchScoreController");

const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");

const router = express.Router();

// Submit a new score for word search
router.post(
  "/submit",
  authenticate,
  WordSearchScoreController.submitWordSearchScore
);

// Get user's own scores for word search
router.get(
  "/my-scores",
  authenticate,
  WordSearchScoreController.getUserWordSearchScores
);

// Admin: Get all scores for word search
router.get(
  "/all-scores",
  authenticate,
  authorize("admin"),
  WordSearchScoreController.getAllWordSearchScores
);

module.exports = router;
