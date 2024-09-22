const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  answer: { type: String, required: true },
});

const fillBlankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  questions: [questionSchema],
  active: { type: Boolean, default: false }, // Include the active field to manage the active state
});

const FillBlank = mongoose.model("FillBlank", fillBlankSchema);

module.exports = FillBlank;
