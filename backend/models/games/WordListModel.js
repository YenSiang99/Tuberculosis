const mongoose = require("mongoose");

const wordListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    words: {
      type: [String],
      required: true,
    },
    description: String,
    active: {
      // Indicates if the word list is currently active
      type: Boolean,
      required: true,
      default: false,
    },
    totalGameTime: {
      // Total time for the game in seconds
      type: Number,
      required: true,
      default: 90, // Set a default value if desired
    },
  },
  {
    timestamps: true,
  }
);

const WordList = mongoose.model("WordList", wordListSchema);

module.exports = WordList;
