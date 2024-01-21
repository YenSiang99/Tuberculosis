// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
      const { username, password, role } = req.body;
  
      // Validate role
      if (!['admin', 'patient', 'healthcare'].includes(role)) {
        return res.status(400).send('Invalid role');
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({ username, password: hashedPassword, role });
      await newUser.save();
  
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(500).send('Error registering user');
    }
  };

  exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (user && await bcrypt.compare(password, user.password)) {
        // Here you can create a token or session
        // And also consider what information you want to include based on the user's role
  
        res.json({ message: 'Login successful', role: user.role });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      res.status(500).send('Error logging in');
    }
  };

  exports.getUsers = async (req, res) => {
    try {
      const users = await User.find({}).select("-password"); // Excludes passwords
      res.json(users);
    } catch (error) {
      res.status(500).send('Error retrieving users');
    }
  };
  