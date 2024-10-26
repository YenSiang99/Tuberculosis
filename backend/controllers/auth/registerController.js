// controllers/auth/registerController.js
const User = require("../../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, group, mcpId } = req.body;
    const profilePicture = req.file
      ? `${process.env.BASE_URL}/media/profiles/${req.file.filename}`
      : undefined;

    let roles = ["doctor", "nurse", "medical assistant"].includes(group)
      ? ["healthcare"]
      : [];

    if (
      roles.includes("healthcare") &&
      (!firstName || !lastName || !group || !mcpId)
    ) {
      return res.status(400).send("Missing healthcare registration details");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      roles,
      firstName,
      lastName,
      group,
      mcpId,
      profilePicture,
    });
    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
};

exports.registerPatient = async (req, res) => {
  console.log(req.body);
  try {
    // req.body will contain text fields
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      phoneNumber,
      country,
      passportNumber,
      nricNumber,
      age,
      diagnosis,
      currentTreatment,
      numberOfTablets,
      diagnosisDate,
      treatmentStartDate,
      treatmentDuration,
      profilePicture,
    } = req.body;
    const profilePicturePath = req.file
      ? `${process.env.BASE_URL}/media/profiles/${req.file.filename}`
      : "";

    const hashedPassword = await bcrypt.hash(password, 10);

    let patientFields = {
      email,
      password: hashedPassword,
      roles: ["patient"],
      group: "patient",
      firstName,
      lastName,
      gender,
      phoneNumber,
      country,
      age,
      diagnosis,
      currentTreatment,
      numberOfTablets,
      diagnosisDate,
      treatmentStartDate,
      treatmentDuration,
      profilePicture: profilePicturePath,
      careStatus: "Continue VOTS",
      videoUploadAlert: true,
      reminderTime: new Date().setHours(22, 0, 0, 0),
      reminderFrequency: 60,
    };

    // Add passportNumber or nricNumber based on the country
    if (country !== "Malaysia") {
      if (!passportNumber) {
        return res
          .status(400)
          .send("Passport number is required for non-Malaysians");
      }
      patientFields.passportNumber = passportNumber;
    } else {
      if (!nricNumber) {
        return res.status(400).send("NRIC number is required for Malaysians");
      }
      patientFields.nricNumber = nricNumber;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    const newUser = new User(patientFields);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.error(error); // Log the full error to the console
    res.status(500).send(`Error registering patient: ${error.message}`);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check required fields
    if (!phoneNumber) {
      return res.status(400).send("Missing required registration details");
    }

    // Check if phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).send("Phone number already registered");
    }

    // Remove the country prefix ('6') from the phone number for password
    const localPhoneNumber = phoneNumber.startsWith("6")
      ? phoneNumber.slice(1)
      : phoneNumber;

    // Hash the phone number without the prefix as the password
    const hashedPassword = await bcrypt.hash(localPhoneNumber, 10);

    // Create new user with phone number (with prefix) but password hashed without the prefix
    const newUser = new User({
      phoneNumber, // Save the phone number with the prefix
      password: hashedPassword, // Save the hashed password without the prefix
      roles: ["user"], // Assign "user" role
      group: "user", // Assign the "user" group
      email: undefined, // Explicitly set email to undefined instead of letting it be null
    });

    // Save the user
    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      // Handle duplicate key errors more specifically
      if (error.keyPattern.email) {
        res.status(409).send("Email already registered");
      } else if (error.keyPattern.phoneNumber) {
        res.status(409).send("Phone number already registered");
      } else {
        res.status(409).send("Duplicate entry detected");
      }
    } else {
      res.status(500).send("Error registering user");
    }
  }
};
