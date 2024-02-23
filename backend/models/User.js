// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Common fields
  profilePicture: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'patient', 'healthcare'] }],
  group: { type: String, required: true, enum: ['patient','doctor', 'nurse', 'medical assistant', ] },
  passwordResetToken: String,
  passwordResetExpires: Date,

  // Healthcare-specific fields
  mcpId: String,

  // Patient-specific fields
  firstName: String,
  lastName: String,
  gender: { type: String, enum: ['male', 'female',''] },
  phoneNumber: String,
  country: String,
  passportNumber: String,
  nricNumber: String,
  age: String,
  careStatus: {type: String,enum: ['Continue VOTS', 'Switch to DOTS', 'Appointment to see doctor']},
  diagnosis: { type: String, enum: ['SPPTB', 'SNTB', 'EXPTB', 'LTBI'] },
  currentTreatment: { type: String, enum: ['Akurit-4', 'Akurit', 'Pyridoxine10mg'] },
  numberOfTablets: Number,
  diagnosisDate: Date,
  treatmentStartDate: Date,
  treatmentDuration: Number,
  videoUploadAlert:  Boolean,
  reminderTime:  Date, 
  reminderFrequency: Number ,  
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
