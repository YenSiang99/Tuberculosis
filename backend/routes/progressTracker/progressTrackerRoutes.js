// routes/appointmentRoutes.js
const express = require('express');
const { progressTracker } = require('../../controllers/progressTracker/progressTrackerController');

// Middleware
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

// Read
router.get('/', authenticate,authorize(['patient','healthcare']), progressTracker);


module.exports = router;
