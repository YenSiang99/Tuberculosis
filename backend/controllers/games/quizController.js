const Quiz = require("../../models/games/QuizModel");

// Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { name, description, timeLimitPerQuestion, questions } = req.body;

    // Validate that `timeLimitPerQuestion` is a number
    if (typeof timeLimitPerQuestion !== "number" || timeLimitPerQuestion <= 0) {
      return res
        .status(400)
        .send("`timeLimitPerQuestion` must be a positive number in seconds.");
    }

    // Check if any quiz exists in the database
    const existingQuizCount = await Quiz.countDocuments();
    let isActive = false;

    if (existingQuizCount === 0) {
      // If this is the first quiz, set it as active
      isActive = true;
    }

    // Create new quiz
    const newQuiz = new Quiz({
      name,
      description,
      timeLimitPerQuestion,
      questions,
      active: isActive, // First quiz will be active, others inactive by default
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

exports.getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).send("Quiz not found.");
    }

    res.status(200).send(quiz);
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
    const updates = req.body;

    // Validate allowed updates
    const allowedUpdates = [
      "name",
      "description",
      "timeLimitPerQuestion",
      "questions",
      "active",
    ];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    // Validate `timeLimitPerQuestion` if it's being updated
    if (updates.timeLimitPerQuestion !== undefined) {
      if (
        typeof updates.timeLimitPerQuestion !== "number" ||
        updates.timeLimitPerQuestion <= 0
      ) {
        return res
          .status(400)
          .send("`timeLimitPerQuestion` must be a positive number in seconds.");
      }
    }

    // Find the quiz to update
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).send("Quiz not found.");
    }

    // Check if the active status is being updated
    if ("active" in updates) {
      if (quiz.active && updates.active === false) {
        // Prevent deactivating the only active quiz
        return res
          .status(400)
          .send({ error: "Cannot deactivate the active quiz." });
      } else if (!quiz.active && updates.active === true) {
        // If setting a non-active quiz to active, deactivate the current active one
        const activeQuiz = await Quiz.findOne({ active: true });
        if (activeQuiz) {
          activeQuiz.active = false;
          await activeQuiz.save();
        }
      }
    }

    // Update the quiz with allowed updates
    Object.assign(quiz, updates);
    await quiz.save();

    res.status(200).send(quiz);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the quiz to delete
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).send("Quiz not found.");
    }

    // Prevent deletion of active quiz
    if (quiz.active) {
      return res.status(400).send({ error: "Cannot delete an active quiz." });
    }

    await quiz.remove();
    res.status(200).send({ message: "Quiz deleted successfully." });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
