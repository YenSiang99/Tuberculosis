// routes/sideEffect/sideEffectRoutes.js
const express = require('express');
const router = express.Router();
const sideEffectController = require('../../controllers/sideEffect/sideEffectController');

// Submit a new side effect report
router.post('/', sideEffectController.submitSideEffectReport);

// Get all side effect reports for healthcare
router.get('/getAllSideEffects', sideEffectController.getAllSideEffects);

// Get side effect reports for a patient
router.get('/:patientId', sideEffectController.getSideEffectReportsForPatient);

module.exports = router;