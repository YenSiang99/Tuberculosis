// const mongoose = require("mongoose");

// const optionSchema = new mongoose.Schema({
//   optionText: String,
//   isCorrect: Boolean,
// });

// const questionSchema = new mongoose.Schema({
//   questionText: String,
//   options: [optionSchema],
// });

// const quizSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       default: "",
//     },
//     timeLimitPerQuestion: {
//       type: Number, // Time limit in seconds for each question
//       required: true,
//       default: 30, // Default time limit if not specified
//     },
//     questions: [questionSchema],
//     active: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Quiz = mongoose.model("Quiz", quizSchema);

// module.exports = Quiz;

const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  optionText: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    en: { type: String, required: true },
    ms: { type: String, required: true },
  },
  options: [optionSchema],
});

const quizSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ms: { type: String, required: true, trim: true },
    },
    description: {
      en: { type: String, default: "" },
      ms: { type: String, default: "" },
    },
    timeLimitPerQuestion: {
      type: Number, // Time limit in seconds for each question
      required: true,
      default: 30, // Default time limit if not specified
    },
    questions: [questionSchema],
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
