// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' },
  timestamp: { type: Date, default: Date.now },
  targetUrl: { type: String, required: false } // Optional field to specify the target URL or route
});

module.exports = mongoose.model('Notification', notificationSchema);
