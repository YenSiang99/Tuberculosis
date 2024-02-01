// controllers/users/usersController.js
const User = require('../../models/User');

// Middleware
const { uploadProfile } = require('../../middlewares/multerConfig'); 

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Excludes passwords from the result
    res.json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users');
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