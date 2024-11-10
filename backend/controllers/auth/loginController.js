// controllers/auth/loginController.js
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Notification = require("../../models/Notification");
const Video = require("../../models/Video");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // "email" field can be phone or email

    // console.log("this is login body", req.body);

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
    const accessToken = jwt.sign(
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
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token in database and wait for it to complete
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { refreshToken: refreshToken },
      { new: true } // This returns the updated document
    );

    // console.log("Updated user refresh token:", {
    //   userId: updatedUser._id,
    //   hasRefreshToken: !!updatedUser.refreshToken,
    //   refreshToken: refreshToken,
    // });

    // Verify the token was stored
    const checkUser = await User.findById(user._id);
    // console.log("Verified stored token:", {
    //   userId: checkUser._id,
    //   hasRefreshToken: !!checkUser.refreshToken,
    //   tokensMatch: checkUser.refreshToken === refreshToken,
    // });

    // Role-based logic (healthcare/patient vs normal users)
    if (user.roles.includes("patient")) {
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

    res.json({
      accessToken,
      refreshToken,
      roles: user.roles,
    });
  } catch (error) {
    res.status(500).send(`Error during login: ${error.message}`);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    // console.log("Received refresh token:", refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // console.log("Decoded refresh token:", decoded);

    // Find user and validate refresh token
    const user = await User.findById(decoded.userId).select("+refreshToken");
    // console.log("User lookup result:", {
    //   found: !!user,
    //   hasStoredToken: !!user?.refreshToken,
    //   tokensMatch: user?.refreshToken === refreshToken,
    // });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
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
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    // console.log("Generated new access token");
    res.json({ accessToken });
  } catch (error) {
    // console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Add this debugging route to check the tokens
exports.debugTokens = async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the stored refresh token
    const storedRefreshToken = user.refreshToken;

    try {
      // Try to verify it
      const decoded = jwt.verify(
        storedRefreshToken,
        process.env.JWT_REFRESH_SECRET
      );
      // console.log(
      //   "Stored token is valid, expires:",
      //   new Date(decoded.exp * 1000)
      // );
    } catch (err) {
      // console.log("Stored token is invalid:", err.message);
    }

    res.json({
      hasRefreshToken: !!user.refreshToken,
      tokenExpiry: user.refreshToken ? jwt.decode(user.refreshToken).exp : null,
      currentTime: Math.floor(Date.now() / 1000),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
