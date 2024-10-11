const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  optionText: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  nextStep: { type: String, required: true }, // References stepId or endId
});

const stepSchema = new mongoose.Schema({
  stepId: { type: String, required: true }, // Custom identifier for the step
  content: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  options: [optionSchema],
});

const endSchema = new mongoose.Schema({
  endId: { type: String, required: true }, // Custom identifier for the end
  content: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  endType: { type: String, required: true }, // 'positive' or 'negative'
});

const storySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  active: { type: Boolean, default: false },
  steps: [stepSchema],
  ends: [endSchema],
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
