// models/score/InteractiveStoryScoreModel.js
const mongoose = require("mongoose");

const interactiveStoryScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story", // Reference to the story the score is associated with
      required: true,
    },
    numberOfRetries: {
      type: Number, // Number of retries the player took
      required: true,
    },
    totalTimeTaken: {
      type: Number, // in seconds
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

const InteractiveStoryScore = mongoose.model(
  "InteractiveStoryScore",
  interactiveStoryScoreSchema
);
module.exports = InteractiveStoryScore;
