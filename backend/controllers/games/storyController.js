const Story = require("../../models/games/StoryModel");

exports.createStory = async (req, res) => {
  try {
    const { active } = req.body;

    // Check if any story exists in the database
    const existingStoryCount = await Story.countDocuments();
    let isActive = false;

    if (existingStoryCount === 0) {
      // If this is the first story, set it as active
      isActive = true;
    }

    const newStory = new Story({
      ...req.body,
      active: isActive, // First story will be active, others inactive by default
    });

    await newStory.save();
    res.status(201).send(newStory);
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
    const { id } = req.params;
    const updates = req.body;

    // Find the story to update
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).send({ error: "Story not found." });
    }

    // Check if the active status is being updated
    if ("active" in updates) {
      if (story.active && updates.active === false) {
        // Prevent deactivating the only active story
        return res
          .status(400)
          .send({ error: "Cannot deactivate the active story." });
      } else if (!story.active && updates.active === true) {
        // If setting a non-active story to active, deactivate the current active one
        const activeStory = await Story.findOne({ active: true });
        if (activeStory) {
          activeStory.active = false;
          await activeStory.save();
        }
      }
    }

    // Update the story with allowed updates
    Object.assign(story, updates);
    await story.save();

    res.send(story);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete Story
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the story to delete
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).send({ error: "Story not found." });
    }

    // Prevent deletion of active story
    if (story.active) {
      return res.status(400).send({ error: "Cannot delete an active story." });
    }

    await story.remove();
    res.send({ message: "Story deleted successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
