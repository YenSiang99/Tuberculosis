// controllers/score/InteractiveStoryScoreController.js
const InteractiveStoryScore = require("../../models/score/StoryScoreModel");
const Story = require("../../models/games/StoryModel");

// Submit a new interactive story score
exports.submitStoryScore = async (req, res) => {
  try {
    const { numberOfRetries, totalTimeTaken } = req.body;
    const userId = req.user.userId;

    // Find the active story
    const activeStory = await Story.findOne({ active: true });
    if (!activeStory) {
      return res.status(400).json({ message: "No active story available." });
    }

    // Create a new score entry
    const newScore = new InteractiveStoryScore({
      user: userId,
      story: activeStory._id, // Associate the score with the active story
      numberOfRetries,
      totalTimeTaken,
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's own historical interactive story scores
exports.getUserStoryScores = async (req, res) => {
  try {
    const userId = req.user.userId;
    const scores = await InteractiveStoryScore.find({ user: userId })
      .populate("story", "title description") // Populate story details
      .sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all users' historical interactive story scores
exports.getAllStoryScores = async (req, res) => {
  try {
    const scores = await InteractiveStoryScore.find()
      .populate("user", "username")
      .populate("story", "title description") // Populate story details
      .sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
