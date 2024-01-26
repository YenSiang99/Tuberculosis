// controllers/auth/registerController.js
const User = require('../../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, group, mcpId } = req.body;

    let roles;
    if (['doctor', 'nurse', 'medical assistant'].includes(group)) {
      roles = ['healthcare'];
    }

    if (roles.includes('healthcare') && (!firstName || !lastName || !group || !mcpId)) {
      return res.status(400).send('Missing healthcare registration details');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, roles, firstName, lastName, group, mcpId });
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error); // Log the full error to the console
    res.status(500).send('Error registering user');
  }
};


exports.registerPatient = async (req, res) => {
  try {
    const {
      email, password, firstName, lastName, gender, phoneNumber, country,
      passportNumber, nricNumber, dateOfBirth, diagnosis, currentTreatment,
      numberOfTablets, treatmentStartMonth
    } = req.body;

    let patientFields = {
      email, 
      password: await bcrypt.hash(password, 10), 
      roles: ['patient'], 
      group : 'patient',
      firstName, 
      lastName, 
      gender,
      phoneNumber, 
      country, 
      dateOfBirth, 
      diagnosis,
      currentTreatment, 
      numberOfTablets, 
      treatmentStartMonth
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

    const newUser = new User(patientFields);
    await newUser.save();
    res.status(201).send('Patient registered successfully');
  } catch (error) {
    console.error(error); // Log the full error to the console
    res.status(500).send(`Error registering patient: ${error.message}`);
  }
};

