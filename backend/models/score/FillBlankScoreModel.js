const mongoose = require("mongoose");

const fillBlankScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fillBlank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FillBlank",
      required: true,
    },
    totalTimeTaken: {
      type: Number, // in seconds
      required: true,
    },
    totalGameTime: {
      type: Number, // in seconds
      required: true,
    },
    score: {
      type: Number, // Number of correct answers
      required: true,
    },
    totalPossibleScore: {
      type: Number, // Total number of questions
      required: true,
    },
    accuracyRate: {
      type: Number, // Percentage of correct answers
      required: true,
    },
    completionStatus: {
      type: String,
      enum: ["Completed", "Incomplete"],
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

const FillBlankScore = mongoose.model("FillBlankScore", fillBlankScoreSchema);
module.exports = FillBlankScore;
