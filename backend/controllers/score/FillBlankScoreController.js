const FillBlankScore = require("../../models/score/FillBlankScoreModel");
const FillBlank = require("../../models/games/FillBlankModel");

// Submit a new fill-in-the-blanks score
exports.submitFillBlankScore = async (req, res) => {
  try {
    const { totalTimeTaken, score } = req.body;
    const userId = req.user.userId;

    // Find the active fill-in-the-blanks game
    const activeFillBlank = await FillBlank.findOne({ active: true });
    if (!activeFillBlank) {
      return res
        .status(400)
        .json({ message: "No active fill-in-the-blanks game available." });
    }

    const totalPossibleScore = activeFillBlank.questions.length;
    const accuracyRate = (score / totalPossibleScore) * 100;
    const totalGameTime = activeFillBlank.totalGameTime;
    const completionStatus =
      totalTimeTaken <= totalGameTime ? "Completed" : "Incomplete";

    // Create a new score entry
    const newScore = new FillBlankScore({
      user: userId,
      fillBlank: activeFillBlank._id,
      totalTimeTaken,
      totalGameTime,
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

// Get user's own historical fill-in-the-blanks scores
exports.getUserFillBlankScores = async (req, res) => {
  try {
    const userId = req.user.userId;
    const scores = await FillBlankScore.find({ user: userId })
      .populate("fillBlank", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all users' historical fill-in-the-blanks scores
exports.getAllFillBlankScores = async (req, res) => {
  try {
    const scores = await FillBlankScore.find()
      .populate("user", "email firstName lastName")
      .populate("fillBlank", "name description totalGameTime questions")
      .sort({ createdAt: -1 })
      .lean();

    // Include totalPossibleScore if not stored in score
    scores.forEach((score) => {
      if (!score.totalPossibleScore && score.fillBlank?.questions) {
        score.totalPossibleScore = score.fillBlank.questions.length;
      }
    });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
