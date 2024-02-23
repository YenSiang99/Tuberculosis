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
router.get('/profile', authenticate, usersController.getUserProfile);
router.post('/uploadProfilePicture/:userId', authenticate, uploadProfile, usersController.uploadProfilePicture);
router.post('/changePassword', authenticate, usersController.changePassword);
router.put('/profile', authenticate, usersController.updateProfile);
router.put('/uploadProfilePicture', authenticate, uploadProfile, usersController.updateProfilePicture);
router.put('/patients/treatment/:patientId', authenticate, usersController.updatePatientTreatmentInfo);
router.post('/forgotPassword', usersController.forgotPassword);
router.post('/resetPassword', usersController.resetPassword);
router.patch('/settings', authenticate, usersController.updateSettings);
router.get('/settings', authenticate, usersController.getSettings);


module.exports = router;
