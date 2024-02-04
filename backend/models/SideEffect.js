// models/SideEffect.js
const mongoose = require('mongoose');

const SideEffectSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  sideEffects: [{
    effect: String,
    grade: Number,
    description: String, // For "Others" option
  }],
});

module.exports = mongoose.model('SideEffect', SideEffectSchema);
