// controllers/auth/loginController.js
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Notification = require('../../models/Notification'); 
const Video = require('../../models/Video'); 

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid email or password');
    }

    // If email and password are correct, generate a token
    const token = jwt.sign({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullname: user.firstName + ' ' + user.lastName, 
        roles: user.roles,
        group: user.group,
        profilePicture: user.profilePicture,
      },
      'yourSecretKey', // Replace with your secret key
      { expiresIn: '1h' }
    );

    if (user.roles.includes('patient')) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset hours to start of the day

      const videoUploaded = await Video.findOne({
        patient: user._id,
        date: { $gte: today }
      });

      // Check if a notification for uploading a video was already sent today
      const notificationSentToday = await Notification.findOne({
        recipient: user._id,
        message: "Don't forget to upload your daily video!",
        timestamp: { $gte: today } // Check if it was created today
      });

      // Only create a new notification if a video hasn't been uploaded and no notification has been sent today
      if (!videoUploaded && !notificationSentToday) {
        const notification = new Notification({
          recipient: user._id,
          message: "Don't forget to upload your daily video!",
          targetUrl: "/patientvideo"
        });
        await notification.save();
      }
    }

    // Send the token to the client
    res.json({ token, roles: user.roles });
    
  } catch (error) {
    res.status(500).send(`Error during login: ${error.message}`);
  }
};
