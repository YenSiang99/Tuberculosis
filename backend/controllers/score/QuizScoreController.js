// controllers/score/QuizScoreController.js
const QuizScore = require("../../models/score/QuizScoreModel");
const Quiz = require("../../models/games/QuizModel");

// Submit a new quiz score
// exports.submitQuizScore = async (req, res) => {
//   try {
//     const { totalTimeTaken, score, completionStatus } = req.body;
//     const userId = req.user.userId;

//     // Find the active quiz
//     const activeQuiz = await Quiz.findOne({ active: true });
//     if (!activeQuiz) {
//       return res.status(400).json({ message: "No active quiz available." });
//     }

//     // Create a new score entry
//     const newScore = new QuizScore({
//       user: userId,
//       quiz: activeQuiz._id, // Associate the score with the active quiz
//       totalTimeTaken,
//       score,
//       completionStatus,
//     });

//     await newScore.save();
//     res.status(201).json(newScore);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.submitQuizScore = async (req, res) => {
  try {
    const { totalTimeTaken, score, completionStatus } = req.body;
    const userId = req.user.userId;

    // Find the active quiz
    const activeQuiz = await Quiz.findOne({ active: true });
    if (!activeQuiz) {
      return res.status(400).json({ message: "No active quiz available." });
    }

    const totalPossibleScore = activeQuiz.questions.length;
    const accuracyRate = (score / totalPossibleScore) * 100;
    const averageTimePerQuestion = totalTimeTaken / totalPossibleScore;
    const timeLimitPerQuestion = activeQuiz.timeLimitPerQuestion;

    // Create a new score entry
    const newScore = new QuizScore({
      user: userId,
      quiz: activeQuiz._id,
      totalTimeTaken,
      averageTimePerQuestion,
      timeLimitPerQuestion, // Include the time limit per question
      score,
      totalPossibleScore,
      accuracyRate,
      completionStatus,
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's own historical quiz scores

exports.getUserQuizScores = async (req, res) => {
  try {
    const userId = req.user.userId;
    const scores = await QuizScore.find({ user: userId })
      .populate("quiz", "name description") // We don't need timeLimitPerQuestion here as it's stored directly in the score
      .sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Admin: Get all users' historical quiz scores
exports.getAllQuizScores = async (req, res) => {
  try {
    const scores = await QuizScore.find()
      .populate("user", "username")
      .populate("quiz", "name description") // Populate quiz details
      .sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
