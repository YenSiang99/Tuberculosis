const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  optionText: { type: String, required: true },
  nextStep: { type: String, required: true }, // Next step or end content
});

const stepSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Step content is now the identifier
  options: [optionSchema],
});

const endSchema = new mongoose.Schema({
  content: { type: String, required: true }, // End content
  endType: { type: String, required: true }, // 'positive' or 'negative'
});

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: false },
  steps: [stepSchema],
  ends: [endSchema],
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
