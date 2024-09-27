const FillBlank = require("../../models/games/FillBlankModel");

exports.createFillBlank = async (req, res) => {
  try {
    // Deactivate all other fill blanks if the new one is set to active
    if (req.body.active) {
      await FillBlank.updateMany({}, { active: false });
    }

    const fillBlank = new FillBlank(req.body); // Directly use the request body for creation
    await fillBlank.save();

    res.status(201).send(fillBlank);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getFillBlanks = async (req, res) => {
  try {
    const fillBlanks = await FillBlank.find();
    res.status(200).send(fillBlanks);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getFillBlankById = async (req, res) => {
  try {
    const fillBlank = await FillBlank.findById(req.params.id);
    if (!fillBlank) {
      return res.status(404).send("Fill-in-the-Blanks set not found.");
    }
    res.status(200).send(fillBlank);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getActiveFillBlank = async (req, res) => {
  try {
    // Find the first FillBlank set that is marked as active
    const activeFillBlank = await FillBlank.findOne({ active: true });

    if (!activeFillBlank) {
      return res.status(404).send("No active Fill-in-the-Blanks set found.");
    }

    res.status(200).send(activeFillBlank);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateFillBlank = async (req, res) => {
  try {
    // Deactivate all other fill blanks if this one is set to active
    if (req.body.active) {
      await FillBlank.updateMany(
        { _id: { $ne: req.params.id } }, // Ensure the current one is not deactivated
        { active: false }
      );
    }

    const fillBlank = await FillBlank.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!fillBlank) {
      return res.status(404).send("Fill-in-the-Blanks set not found.");
    }

    res.send(fillBlank);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteFillBlank = async (req, res) => {
  try {
    const fillBlank = await FillBlank.findByIdAndDelete(req.params.id);
    if (!fillBlank) {
      return res.status(404).send("Fill-in-the-Blanks set not found.");
    }

    res.send(fillBlank);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
