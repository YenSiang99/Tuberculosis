// models/games/WordSearchScoreModel.js
const mongoose = require("mongoose");

const wordSearchScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wordList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WordList",
      required: true,
    },
    totalTimeTaken: {
      type: Number, // in seconds
      required: true,
    },
    accuracyRate: {
      type: Number, // percentage (e.g., 85.5%)
      required: true,
    },
    longestWordFound: {
      type: String,
      required: false,
    },
    score: {
      type: Number, // number of words found
      required: true,
    },
    completionStatus: {
      type: String,
      enum: ["Completed", "Incomplete"],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const WordSearchScore = mongoose.model(
  "WordSearchScore",
  wordSearchScoreSchema
);
module.exports = WordSearchScore;
