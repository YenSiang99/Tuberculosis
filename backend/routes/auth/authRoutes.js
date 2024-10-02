// routes/auth/authRoutes.js
const express = require("express");
const loginController = require("../../controllers/auth/loginController");
const registerController = require("../../controllers/auth/registerController");
const {
  uploadVideo,
  uploadProfile,
} = require("../../middlewares/multerConfig");

const router = express.Router();

// Registration
router.post("/register", uploadProfile, registerController.register);
router.post(
  "/registerPatient",
  uploadProfile,
  registerController.registerPatient
);
router.post("/registerUser", registerController.registerUser);

//Login that handles both phone no login and email login
router.post("/login", loginController.login);

module.exports = router;
