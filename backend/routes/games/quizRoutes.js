const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/games/quizController");

// Create
router.post("/", quizController.createQuiz);

// Read
router.get("/", quizController.getAllQuizzes);
router.get("/active", quizController.getActiveQuiz);
router.get("/:id", quizController.getQuizById); // New route for fetching quiz by ID

// Update
router.put("/:id", quizController.updateQuiz);

// Delete
router.delete("/:id", quizController.deleteQuiz);

module.exports = router;
