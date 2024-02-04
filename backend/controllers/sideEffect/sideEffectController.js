// controllers/sideEffect/sideEffectController.js
const SideEffect = require('../../models/SideEffect');

exports.submitSideEffectReport = async (req, res) => {
  try {
    const sideEffect = new SideEffect(req.body);
    await sideEffect.save();
    res.status(201).send(sideEffect);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getSideEffectReportsForPatient = async (req, res) => {
  try {
    const sideEffects = await SideEffect.find({ patientId: req.params.patientId });
    if (!sideEffects.length) {
      return res.status(404).send('No side effects found for the given patient ID.');
    }
    res.send(sideEffects);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllSideEffects = async (req, res) => {
  try {
    const sideEffects = await SideEffect.find({})
      .populate('patientId', '-password') // Exclude the password field
      .exec();

    res.send(sideEffects);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

