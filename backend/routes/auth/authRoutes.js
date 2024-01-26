// routes/auth/authRoutes.js
const express = require('express');
const loginController = require('../../controllers/auth/loginController');
const registerController = require('../../controllers/auth/registerController');

const router = express.Router();

router.post('/login', loginController.login);

router.post('/register', registerController.register);
router.post('/registerPatient', registerController.registerPatient);

module.exports = router;
