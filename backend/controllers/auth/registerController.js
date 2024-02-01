// controllers/auth/registerController.js
const User = require('../../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, group, mcpId, profilePicture } = req.body;

    let roles;
    if (['doctor', 'nurse', 'medical assistant'].includes(group)) {
      roles = ['healthcare'];
    }

    if (roles.includes('healthcare') && (!firstName || !lastName || !group || !mcpId)) {
      return res.status(400).send('Missing healthcare registration details');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, roles, firstName, lastName, group, mcpId, profilePicture });
    await newUser.save();

    res.status(201).send('User registered successfully');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
};

exports.registerPatient = async (req, res) => {
  console.log(req.body); 
  try {
    // req.body will contain text fields
    const {
      email, password, firstName, lastName, gender, phoneNumber, country,
      passportNumber, nricNumber, age, diagnosis, currentTreatment,
      numberOfTablets, treatmentStartMonth, profilePicture
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let patientFields = {
      email,
      password: hashedPassword,
      roles: ['patient'],
      group: 'patient',
      firstName,
      lastName,
      gender,
      phoneNumber,
      country,
      age,
      diagnosis,
      currentTreatment,
      numberOfTablets,
      treatmentStartMonth,
      profilePicture
    };

    // Add passportNumber or nricNumber based on the country
    if (country !== 'Malaysia') {
      if (!passportNumber) {
        return res.status(400).send('Passport number is required for non-Malaysians');
      }
      patientFields.passportNumber = passportNumber;
    } else {
      if (!nricNumber) {
        return res.status(400).send('NRIC number is required for Malaysians');
      }
      patientFields.nricNumber = nricNumber;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already registered');
    }

    const newUser = new User(patientFields);
    await newUser.save();
    res.status(201).send('Patient registered successfully');
  } catch (error) {
    console.error(error); // Log the full error to the console
    res.status(500).send(`Error registering patient: ${error.message}`);
  }
};

