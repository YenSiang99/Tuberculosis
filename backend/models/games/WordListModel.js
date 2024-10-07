// models/games/WordListModel.js

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
      type: Map,
      of: [String],
      required: true,
      default: {},
    },
    description: String,
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    totalGameTime: {
      type: Number,
      required: true,
      default: 90,
    },
  },
  {
    timestamps: true,
  }
);

const WordList = mongoose.model("WordList", wordListSchema);

module.exports = WordList;
