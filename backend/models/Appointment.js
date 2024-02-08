const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  healthcare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['awaiting approval', 'approved', 'cancelled'],
    default: 'awaiting approval'
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
