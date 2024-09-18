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
  },
  {
    timestamps: true,
  }
);

const WordList = mongoose.model("WordList", wordListSchema);

module.exports = WordList;
