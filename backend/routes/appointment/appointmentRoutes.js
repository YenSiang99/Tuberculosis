// routes/appointmentRoutes.js
const express = require('express');
const { createAppointment,
    updateAppointment,
    readPatientAppointments,
    readHealthcareAppointments,
    showAvailableSlots,
    showRequestedAppointments,
    deleteAppointment,
 } = require('../../controllers/appointment/appointmentController');

// Middleware
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

// Create
router.post('/', authenticate, createAppointment);

// Update
router.patch('/:appointmentId',authenticate,authorize('healthcare'),  updateAppointment);

// Read
router.get('/availableSlots', authenticate, showAvailableSlots);
router.get('/healthcareAppointments', authenticate, authorize('healthcare'), readHealthcareAppointments);

router.get('/patientAppointments', authenticate, readPatientAppointments);
router.get('/requestedAppointments', authenticate, authorize('healthcare'), showRequestedAppointments);

// Delete
router.delete('/:appointmentId', authenticate,authorize(["healthcare","patient"]), deleteAppointment);
// router.delete('/:appointmentId', authenticate, deleteAppointment);

module.exports = router;
