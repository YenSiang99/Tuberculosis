// models/score/QuizScoreModel.js
const mongoose = require("mongoose");

const quizScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz", // Reference the active quiz
      required: true,
    },
    totalTimeTaken: {
      type: Number, // in seconds
      required: true,
    },
    score: {
      type: Number, // quiz score
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

const QuizScore = mongoose.model("QuizScore", quizScoreSchema);
module.exports = QuizScore;
