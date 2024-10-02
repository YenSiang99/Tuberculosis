// controllers/auth/loginController.js
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Notification = require("../../models/Notification");
const Video = require("../../models/Video");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // "email" field can be phone or email

    console.log("this is login body", req.body);

    // First, check if the provided text is a phone number or email
    const isPhoneNumber = /^\d{9,10}$/.test(email); // Adjust based on expected phone number length (9 or 10 digits for local numbers)
    let user;

    if (isPhoneNumber) {
      // Add the country code prefix (e.g., +60 for Malaysia)
      const phoneNumberWithPrefix = `60${email.replace(/^0/, "")}`; // Replace leading 0 with country code

      // Find the user by phone number with the country code prefix
      user = await User.findOne({ phoneNumber: phoneNumberWithPrefix });
    } else {
      // Find the user by email
      user = await User.findOne({ email });
    }

    // If user is not found
    if (!user) {
      return res.status(401).send("Invalid email/phone or password");
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email/phone or password");
    }

    // Generate a token
    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullname: user.firstName + " " + user.lastName,
        roles: user.roles,
        group: user.group,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
      },
      "yourSecretKey", // Replace with your secret key
      { expiresIn: "1h" }
    );

    // Role-based logic (healthcare/patient vs normal users)
    if (user.roles.includes("patient") || user.roles.includes("healthcare")) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset hours to start of the day

      const videoUploaded = await Video.findOne({
        patient: user._id,
        date: { $gte: today },
      });

      // Check if a notification for uploading a video was already sent today
      const notificationSentToday = await Notification.findOne({
        recipient: user._id,
        message: "Don't forget to upload your daily video!",
        timestamp: { $gte: today }, // Check if it was created today
      });

      // Only create a new notification if a video hasn't been uploaded and no notification has been sent today
      if (!videoUploaded && !notificationSentToday) {
        const notification = new Notification({
          recipient: user._id,
          message: "Don't forget to upload your daily video!",
          targetUrl: "/patient/video",
        });
        await notification.save();
      }
    }

    // Send the token and user roles to the client
    res.json({ token, roles: user.roles });
  } catch (error) {
    res.status(500).send(`Error during login: ${error.message}`);
  }
};
