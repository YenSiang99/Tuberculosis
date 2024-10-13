const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  textBefore: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  textAfter: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  answer: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  position: { type: Number, default: null }, // Position of the blank in the sentence (optional, for word highlight)
});

const fillBlankSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  totalGameTime: { type: Number, required: true, default: 60 }, // Total game time in seconds
  questions: [questionSchema],
  active: { type: Boolean, default: false }, // Include the active field to manage the active state
});

const FillBlank = mongoose.model("FillBlank", fillBlankSchema);

module.exports = FillBlank;
