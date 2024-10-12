// models/games/WordListModel.js

const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ms: { type: String, required: true },
});

const wordListSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, unique: true, trim: true },
      ms: { type: String, required: true, unique: true, trim: true },
    },
    words: {
      type: [wordSchema],
      required: true,
      default: [],
    },
    description: {
      en: { type: String, default: "" },
      ms: { type: String, default: "" },
    },
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
