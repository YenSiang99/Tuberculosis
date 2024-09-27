// routes/games/fillBlankRoutes.js
const express = require("express");
const FillBlankScoreController = require("../../controllers/score/FillBlankScoreController");

const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");

const router = express.Router();

// Submit a new score for fill-in-the-blanks
router.post(
  "/submit",
  authenticate,
  FillBlankScoreController.submitFillBlankScore
);

// Get user's own scores for fill-in-the-blanks
router.get(
  "/my-scores",
  authenticate,
  FillBlankScoreController.getUserFillBlankScores
);

// Admin: Get all scores for fill-in-the-blanks
router.get(
  "/all-scores",
  authenticate,
  authorize("admin"),
  FillBlankScoreController.getAllFillBlankScores
);

module.exports = router;
