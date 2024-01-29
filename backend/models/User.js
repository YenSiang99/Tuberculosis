// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Common fields
  profilePicture: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'patient', 'healthcare'] }],
  group: { type: String, required: true, enum: ['patient','doctor', 'nurse', 'medical assistant', ] },

  // Patient-specific fields
  firstName: String,
  lastName: String,
  gender: { type: String, enum: ['male', 'female'] },
  phoneNumber: String,
  country: String,
  passportNumber: String,
  nricNumber: String,
  age: String,
  diagnosis: { type: String, enum: ['SPPTB', 'SNTB', 'EXPTB', 'LTBI'] },
  currentTreatment: { type: String, enum: ['Akurit-4', 'Akurit', 'Pyridoxine10mg'] },
  numberOfTablets: Number,
  treatmentStartMonth: String, // Or Date type, depending on the format you choose
});

module.exports = mongoose.model('User', userSchema);
