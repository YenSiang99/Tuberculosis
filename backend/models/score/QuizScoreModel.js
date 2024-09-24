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
      ref: "Quiz",
      required: true,
    },
    totalTimeTaken: {
      type: Number, // in seconds
      required: true,
    },
    averageTimePerQuestion: {
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
    timestamps: true,
  }
);

const QuizScore = mongoose.model("QuizScore", quizScoreSchema);
module.exports = QuizScore;
