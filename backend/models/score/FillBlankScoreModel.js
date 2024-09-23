// models/score/FillBlankScoreModel.js
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
      ref: "FillBlank", // Reference the active fill-in-the-blanks game
      required: true,
    },
    totalTimeTaken: {
      type: Number, // in seconds
      required: true,
    },
    score: {
      type: Number, // score based on correct answers
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

const FillBlankScore = mongoose.model("FillBlankScore", fillBlankScoreSchema);
module.exports = FillBlankScore;
