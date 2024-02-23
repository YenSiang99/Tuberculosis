// controllers/users/usersController.js
const User = require('../../models/User');

// Middleware
const { uploadProfile } = require('../../middlewares/multerConfig'); 

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sendEmail = require('../../utils/sendEmail');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Excludes passwords from the result
    res.json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users');
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ group: 'patient' }).select("-password"); // Filters users who are patients
    res.json(patients);
  } catch (error) {
    res.status(500).send('Error retrieving patients');
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving user profile');
  }
};


exports.uploadProfilePicture = async (req, res) => {
  const userId = req.params.userId; // Assuming the user ID is passed in the URL

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (req.file) {
      user.profilePicture = `${process.env.BASE_URL}/media/profiles/${req.file.filename}`;
      await user.save();
      return res.status(200).json({ message: "Profile picture uploaded successfully", profilePicture: user.profilePicture });
    } else {
      return res.status(400).send('No file uploaded');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading profile picture');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send('Current password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.send('Password updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating password');
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.userId; 
  const updates = req.body;

  // Fields that are allowed to be updated
  const allowedUpdates = ['email', 'firstName', 'lastName', 'gender', 'age', 'phoneNumber', 'country', 'passportNumber', 'nricNumber', 'diagnosis', 'currentTreatment', 'numberOfTablets', 'diagnosisDate', 'treatmentStartDate', 'treatmentDuration', 'mcpId','group'];
  
  // Ensure only allowed fields are updated
  const updateFields = Object.keys(updates).filter(key => allowedUpdates.includes(key));
  const updateValues = {};
  updateFields.forEach(field => updateValues[field] = updates[field]);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Update the fields
    Object.assign(user, updateValues);

    await user.save();
    res.send({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error updating profile' });
  }
};

exports.updateProfilePicture = async (req, res) => {
  const userId = req.user.userId; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (req.file) {
      // Delete old profile picture if it exists
      if (user.profilePicture) {
        const existingFilePath = user.profilePicture.replace(`${process.env.BASE_URL}/media/profiles/`, '');
        const fullPath = path.join(__dirname, '../../media/profiles/', existingFilePath);

        // Use fs.unlink to delete the file asynchronously
        fs.unlink(fullPath, err => {
          if (err) {
            // Log the error but do not stop the process
            console.error('Failed to delete old profile picture:', err);
          }
        });
      }

      // Update user's profile picture with the new file
      user.profilePicture = `${process.env.BASE_URL}/media/profiles/${req.file.filename}`;
      await user.save();

      return res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: user.profilePicture
      });
    } else {
      return res.status(400).send('No file uploaded');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile picture');
  }
};

exports.updatePatientTreatmentInfo = async (req, res) => {
  const patientId = req.params.patientId; 
  const updates = req.body;

  // Fields related to treatment that are allowed to be updated
  const allowedUpdates = [
    'diagnosis', 'currentTreatment', 'numberOfTablets', 
    'diagnosisDate', 'treatmentStartDate', 'treatmentDuration', 'careStatus'
  ];

  // Filter updates to ensure only allowed fields are processed
  const updateFields = Object.keys(updates).filter(key => allowedUpdates.includes(key));
  const updateValues = {};
  updateFields.forEach(field => updateValues[field] = updates[field]);

  try {
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).send({ message: 'Patient not found' });
    }

    // Ensure the user being updated is a patient
    if (patient.group !== 'patient') {
      return res.status(403).send({ message: 'Can only update treatment info for patients' });
    }

    // Update the treatment details
    Object.assign(patient, updateValues);
    await patient.save();

    res.status(200).send({ message: 'Treatment information updated successfully', patient });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating treatment information' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'User not found.', userExists: false });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    const message = `
    You are receiving this email because you has requested the reset of a password for your account. \n
    Please click on the following link, or paste it into your browser to complete the process within 1 hour of receiving it: \n
    ${resetUrl} \n
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ message: 'Email sent.', userExists: true });

    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(500).send('Email could not be sent.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error resetting password.');
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  console.log("Hashed Token:", hashedToken);

  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // Log if a user was found or not
    if (!user) {
      console.log("No user found with that token or token has expired.");
      return res.status(400).send('Password reset token is invalid or has expired.');
    } else {
      console.log("User found:", user.email); // Logging the user's email for verification
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log("Password has been reset for user:", user.email);
    res.send('Your password has been changed.');
  } catch (error) {
    console.error("Error resetting the password:", error);
    res.status(500).send('Error resetting the password.');
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    let { videoUploadAlert, reminderTime, reminderFrequency } = req.body;

    // If videoUploadAlert is true and reminderTime or reminderFrequency are null,
    // set them to their default values.
    if (videoUploadAlert) {
      if (!reminderTime) {
        // Set reminderTime to today at 22:00:00.000
        let defaultTime = new Date();
        defaultTime.setHours(22, 0, 0, 0);
        reminderTime = defaultTime;
      }
      if (!reminderFrequency) {
        reminderFrequency = 60; // Set default reminderFrequency
      }

    } else {
      // If videoUploadAlert is false, set both to null.
      reminderTime = null;
      reminderFrequency = null;
    }

    if (videoUploadAlert) {
      reminderTime = reminderTime !== undefined ? new Date(reminderTime) : new Date().setHours(22, 0, 0, 0);
      reminderFrequency = reminderFrequency !== undefined ? reminderFrequency : 60;
    }
    

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: {
        videoUploadAlert,
        reminderTime,
        reminderFrequency,
      },
    }, { new: true });

    res.status(200).json({ message: 'Settings updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating settings', error: error.message });
  }
};


exports.getSettings = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).select('videoUploadAlert reminderTime reminderFrequency');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const settings = {
      videoUploadAlert: user.videoUploadAlert,
      reminderTime: user.reminderTime,
      reminderFrequency: user.reminderFrequency,
    };
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving settings' });
  }
};
