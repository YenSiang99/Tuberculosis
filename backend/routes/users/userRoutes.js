// routes/users/userRoutes.js
const express = require('express');

// Controllers
const usersController = require('../../controllers/users/userController.js');

// Middleware
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router.get('/', authenticate, authorize('admin'),usersController.getUsers);

module.exports = router;
