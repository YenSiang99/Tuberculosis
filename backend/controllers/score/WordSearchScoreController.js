// controllers/games/WordSearchScoreController.js
const WordSearchScore = require("../../models/score/WordSearchScoreModel");
const WordList = require("../../models/games/WordListModel");

// Submit a new score
exports.submitWordSearchScore = async (req, res) => {
  try {
    const {
      totalTimeTaken,
      accuracyRate,
      longestWordFound,
      score,
      completionStatus,
    } = req.body;
    const userId = req.user.userId;

    // Find the active word list
    const activeWordList = await WordList.findOne({ active: true });
    if (!activeWordList) {
      return res
        .status(400)
        .json({ message: "No active word list available." });
    }

    // Create a new score entry
    const newScore = new WordSearchScore({
      user: userId,
      wordList: activeWordList._id,
      totalTimeTaken,
      accuracyRate,
      longestWordFound,
      score,
      completionStatus,
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's own historical scores for word search
exports.getUserWordSearchScores = async (req, res) => {
  try {
    const userId = req.user.userId;
    const scores = await WordSearchScore.find({ user: userId })
      .populate("wordList") // Populate to get `totalGameTime`
      .lean();

    // Add `totalPossibleScore` and ensure `totalGameTime` is included
    for (let score of scores) {
      if (score.wordList && score.wordList.words) {
        score.totalPossibleScore = score.wordList.words.length;
        score.totalGameTime = score.wordList.totalGameTime;
      } else {
        const wordList = await WordList.findById(score.wordList._id).lean();
        score.totalPossibleScore = wordList.words.length;
        score.totalGameTime = wordList.totalGameTime;
        score.wordList = wordList;
      }
    }

    res.json(scores);
  } catch (error) {
    console.error("Error fetching word search scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin: Get all users' historical scores for word search
exports.getAllWordSearchScores = async (req, res) => {
  try {
    const scores = await WordSearchScore.find()
      .populate("user", "username")
      .populate("wordList", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
