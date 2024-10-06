const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  textBefore: { type: String, required: true }, // Text before the blank
  textAfter: { type: String, required: true }, // Text after the blank
  answer: { type: String, required: true }, // Correct answer (blank word)
  position: { type: Number, default: null }, // Position of the blank in the sentence (optional, for word highlight)
});

const fillBlankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  totalGameTime: { type: Number, required: true, default: 60 }, // Total game time in seconds
  questions: [questionSchema],
  active: { type: Boolean, default: false }, // Include the active field to manage the active state
});

const FillBlank = mongoose.model("FillBlank", fillBlankSchema);

module.exports = FillBlank;
