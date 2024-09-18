const Quiz = require("../../models/games/QuizModel");

// Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { name, description, questions } = req.body;

    // Optionally deactivate all other quizzes
    await Quiz.updateMany({}, { active: false });

    const newQuiz = new Quiz({
      name,
      description,
      questions,
      active: true, // Automatically activate the new quiz
    });
    await newQuiz.save();

    res.status(201).send(newQuiz);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.status(200).send(quizzes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get active quiz
exports.getActiveQuiz = async (req, res) => {
  try {
    const activeQuiz = await Quiz.findOne({ active: true });
    if (!activeQuiz) {
      return res.status(404).send("No active quiz found.");
    }
    res.status(200).send(activeQuiz);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // This includes name, description, questions, and active state
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedQuiz) {
      return res.status(404).send("Quiz not found.");
    }
    res.status(200).send(updatedQuiz);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).send("Quiz not found.");
    }
    res.status(200).send({ message: "Quiz deleted successfully." });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
