// routes/games/quizRoutes.js
const express = require("express");
const QuizScoreController = require("../../controllers/score/QuizScoreController");

const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");

const router = express.Router();

// Submit a new score for quizzes
router.post("/submit", authenticate, QuizScoreController.submitQuizScore);

// Get user's own quiz scores
router.get("/my-scores", authenticate, QuizScoreController.getUserQuizScores);

// Admin: Get all quiz scores
router.get(
  "/all-scores",
  authenticate,
  authorize("admin"),
  QuizScoreController.getAllQuizScores
);

module.exports = router;
