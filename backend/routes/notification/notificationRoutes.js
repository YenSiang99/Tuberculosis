// routes/notification/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification/notificationController'); // Adjust the path as necessary
const authenticate = require('../../middlewares/authenticate'); // Assuming this middleware is already implemented

// Route to create a new notification
router.post('/', authenticate, notificationController.createNotification);

// Route to get all notifications for a user
router.get('/', authenticate, notificationController.getNotifications);

// Route to mark a notification as read
router.patch('/:notificationId/read', authenticate, notificationController.markAsRead);

// Route to read number of unread notifications
router.get('/unread', authenticate, notificationController.getNotifications);

// Route to delete all notifications for a user
router.delete('/deleteAll', authenticate, notificationController.deleteAllNotifications);

module.exports = router;
