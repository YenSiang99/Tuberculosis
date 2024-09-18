const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/games/quizController");

router.post("/", quizController.createQuiz);
router.get("/", quizController.getAllQuizzes);
router.get("/active", quizController.getActiveQuiz);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);

module.exports = router;
