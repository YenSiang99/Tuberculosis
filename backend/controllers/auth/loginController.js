// controllers/auth/loginController.js
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign(
      { 
        userId: user._id,
        firstName : user.firstName,
        lastName : user.lastName,
        fullname : user.firstName + ' ' + user.lastName, 
        roles : user.roles,
        group : user.group,
      },
      'yourSecretKey', // Replace with your secret key
      { expiresIn: '1h' }
    );

    // Send the token to the client
    console.log("User roles:", user.roles); // Debugging log
    res.json({ token, roles: user.roles });
    
  } catch (error) {
    res.status(500).send(`Error during login: ${error.message}`);
  }
};
