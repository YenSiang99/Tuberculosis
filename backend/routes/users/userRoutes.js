// routes/users/userRoutes.js
const express = require('express');

// Controllers
const usersController = require('../../controllers/users/userController.js');

// Middleware
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const { uploadVideo, uploadProfile } = require('../../middlewares/multerConfig');

const router = express.Router();

router.get('/', authenticate, authorize('admin'),usersController.getUsers);
router.get('/patients', authenticate, authorize('healthcare'), usersController.getPatients);
router.post('/uploadProfilePicture/:userId', authenticate, uploadProfile, usersController.uploadProfilePicture);

module.exports = router;
