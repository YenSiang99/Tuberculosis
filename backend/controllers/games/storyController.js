const Story = require("../../models/games/StoryModel");

exports.createStory = async (req, res) => {
  try {
    if (req.body.active) {
      // Deactivate all other stories if the new story is set to active
      await Story.updateMany({}, { active: false });
    }
    const story = new Story(req.body);
    await story.save();
    res.status(201).send(story);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).send(stories);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).send({ error: "Story not found." });
    }
    res.status(200).send(story);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getActiveStory = async (req, res) => {
  try {
    const activeStory = await Story.findOne({ active: true });
    if (!activeStory) {
      return res.status(404).send({ error: "No active story found." });
    }
    res.status(200).send(activeStory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateStory = async (req, res) => {
  try {
    if (req.body.active) {
      // Deactivate all other stories if the current one is set to active
      await Story.updateMany({}, { active: false });
    }
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!story) {
      return res.status(404).send({ error: "Story not found." });
    }
    res.send(story);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).send({ error: "Story not found." });
    }
    res.send(story);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
