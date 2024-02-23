// models/SideEffect.js
const mongoose = require('mongoose');

const SideEffectSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  datetime: { // Combine date and time into one field
    type: Date,
    required: true,
  },
  sideEffects: [{
    effect: String,
    grade: Number,
    description: String, // For "Others" option
  }],
});

module.exports = mongoose.model('SideEffect', SideEffectSchema);
