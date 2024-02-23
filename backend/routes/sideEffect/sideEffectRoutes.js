// routes/sideEffect/sideEffectRoutes.js
const express = require('express');
const router = express.Router();
const sideEffectController = require('../../controllers/sideEffect/sideEffectController');
const authenticate = require('../../middlewares/authenticate');

// Submit a new side effect report
router.post('/', authenticate, sideEffectController.submitSideEffectReport);

// Get all side effect reports for healthcare
router.get('/getAllSideEffects', authenticate, sideEffectController.getAllSideEffects);

// Get side effect reports for a patient
router.get('/patient', authenticate, sideEffectController.getSideEffectReportsForPatient);
router.get('/patient/:patientId', authenticate, sideEffectController.getSideEffectsByPatientId);

module.exports = router;