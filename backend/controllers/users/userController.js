// controllers/users/usersController.js
const User = require('../../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Excludes passwords from the result
    res.json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users');
  }
};
