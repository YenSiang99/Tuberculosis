const FillBlank = require("../../models/games/FillBlankModel");

exports.createFillBlank = async (req, res) => {
  try {
    if (req.body.active) {
      // Deactivate all other fill blanks if the new one is set to active
      const activeSetExists = await FillBlank.exists({ active: true });
      if (activeSetExists) {
        await FillBlank.updateMany({}, { active: false });
      }
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
    const { id } = req.params;
    const updates = req.body;

    const fillBlank = await FillBlank.findById(id);
    if (!fillBlank) {
      return res.status(404).send("Fill-in-the-Blanks set not found.");
    }

    if (updates.active && !fillBlank.active) {
      // Deactivate all other fill blanks if this one is set to active
      await FillBlank.updateMany({ _id: { $ne: id } }, { active: false });
    }

    // Prevent deactivating the only active fill blank
    if (fillBlank.active && updates.active === false) {
      const activeCount = await FillBlank.countDocuments({ active: true });
      if (activeCount < 2) {
        return res.status(400).send({
          error:
            "Another fill blank must be set to active before deactivating this one.",
        });
      }
    }

    Object.assign(fillBlank, updates);
    await fillBlank.save();

    res.send(fillBlank);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteFillBlank = async (req, res) => {
  try {
    const { id } = req.params;
    const fillBlank = await FillBlank.findById(id);
    if (!fillBlank) {
      return res.status(404).send("Fill-in-the-Blanks set not found.");
    }

    // Prevent deletion of an active fill blank
    if (fillBlank.active) {
      return res
        .status(400)
        .send({ error: "Cannot delete an active Fill-in-the-Blanks set." });
    }

    await fillBlank.remove();
    res.send({ message: "Fill-in-the-Blanks set deleted successfully." });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
