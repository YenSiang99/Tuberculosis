const Quiz = require("../../models/games/QuizModel");

// Create Quiz
// exports.createQuiz = async (req, res) => {
//   try {
//     const { name, description, questions } = req.body;

//     // Optionally deactivate all other quizzes
//     await Quiz.updateMany({}, { active: false });

//     const newQuiz = new Quiz({
//       name,
//       description,
//       questions,
//       active: true, // Automatically activate the new quiz
//     });
//     await newQuiz.save();

//     res.status(201).send(newQuiz);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

exports.createQuiz = async (req, res) => {
  try {
    const { name, description, timeLimitPerQuestion, questions } = req.body;

    // Validate that `timeLimitPerQuestion` is a number
    if (typeof timeLimitPerQuestion !== "number" || timeLimitPerQuestion <= 0) {
      return res
        .status(400)
        .send("`timeLimitPerQuestion` must be a positive number in seconds.");
    }

    // Optionally deactivate all other quizzes
    await Quiz.updateMany({}, { active: false });

    const newQuiz = new Quiz({
      name,
      description,
      timeLimitPerQuestion,
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
// exports.updateQuiz = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body; // This includes name, description, questions, and active state
//     const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, {
//       new: true,
//     });
//     if (!updatedQuiz) {
//       return res.status(404).send("Quiz not found.");
//     }
//     res.status(200).send(updatedQuiz);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

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

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
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
