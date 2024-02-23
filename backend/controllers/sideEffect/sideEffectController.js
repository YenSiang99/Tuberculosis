// controllers/sideEffect/sideEffectController.js
const SideEffect = require("../../models/SideEffect");
const Notification = require('../../models/Notification'); 
const User = require('../../models/User');

exports.submitSideEffectReport = async (req, res) => {
  try {
    const patientData = {
      ...req.body,
      patient: req.user.userId, 
    };

    const sideEffect = new SideEffect(patientData);
    await sideEffect.save();

    const healthcareStaff = await User.find({ roles: 'healthcare' });

    const patient = await User.findById(patientData.patient);
    const patientName = `${patient.firstName} ${patient.lastName}`; 
    const notificationMessage = `${patientName} submitted a side effect report.`;

    for (const staff of healthcareStaff) {
      const notification = new Notification({
        recipient: staff._id,
        message: notificationMessage,
        targetUrl: "/healthcaresideeffect" 
      });
      await notification.save();
    }

    res.status(201).send(sideEffect);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


exports.getSideEffectReportsForPatient = async (req, res) => {
  const userId = req.user.userId;
  try {
    const sideEffects = await SideEffect.find({ patient: userId });
    if (!sideEffects.length) {
      return res
        .status(404)
        .send("No side effects found for the given patient ID.");
    }
    res.send(sideEffects);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllSideEffects = async (req, res) => {
  try {
    const sideEffects = await SideEffect.find({})
      .populate('patient') // Populate the entire patient document
      .exec();

    res.send(sideEffects);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


exports.getSideEffectsByPatientId = async (req, res) => {
  const { patientId } = req.params; 
  try {
    const sideEffects = await SideEffect.find({ patient: patientId });
    if (!sideEffects.length) {
      return res.status(404).send("No side effects found for the specified patient.");
    }
    res.send(sideEffects);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
