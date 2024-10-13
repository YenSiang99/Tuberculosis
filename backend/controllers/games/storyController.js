const Story = require("../../models/games/StoryModel");

// exports.createStory = async (req, res) => {
//   try {
//     const { active } = req.body;

//     // Check if any story exists in the database
//     const existingStoryCount = await Story.countDocuments();
//     let isActive = false;

//     if (existingStoryCount === 0) {
//       // If this is the first story, set it as active
//       isActive = true;
//     }

//     const newStory = new Story({
//       ...req.body,
//       active: isActive, // First story will be active, others inactive by default
//     });

//     await newStory.save();
//     res.status(201).send(newStory);
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

const validateLanguageFields = (field) => {
  return (
    field &&
    typeof field === "object" &&
    typeof field.en === "string" &&
    typeof field.ms === "string" &&
    field.en.trim() !== "" &&
    field.ms.trim() !== ""
  );
};

exports.createStory = async (req, res) => {
  try {
    const { title, description, steps, ends } = req.body;

    // Validate language fields for title and description
    if (!validateLanguageFields(title)) {
      return res
        .status(400)
        .send("Title must have both 'en' and 'ms' translations.");
    }
    if (!validateLanguageFields(description)) {
      return res
        .status(400)
        .send("Description must have both 'en' and 'ms' translations.");
    }

    // Validate steps
    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).send("Story must have at least one step.");
    }

    const stepIds = new Set();
    for (const step of steps) {
      if (!step.stepId || typeof step.stepId !== "string") {
        return res.status(400).send("Each step must have a unique 'stepId'.");
      }
      if (stepIds.has(step.stepId)) {
        return res.status(400).send(`Duplicate 'stepId' found: ${step.stepId}`);
      }
      stepIds.add(step.stepId);
      if (!validateLanguageFields(step.content)) {
        return res
          .status(400)
          .send("Each step must have 'en' and 'ms' translations for content.");
      }
      if (!Array.isArray(step.options) || step.options.length === 0) {
        return res.status(400).send("Each step must have at least one option.");
      }
      for (const option of step.options) {
        if (!validateLanguageFields(option.optionText)) {
          return res
            .status(400)
            .send(
              "Each option must have 'en' and 'ms' translations for optionText."
            );
        }
        if (
          typeof option.nextStep !== "string" ||
          option.nextStep.trim() === ""
        ) {
          return res
            .status(400)
            .send("Each option must have a valid 'nextStep' identifier.");
        }
      }
    }

    // Validate ends
    if (!Array.isArray(ends) || ends.length === 0) {
      return res.status(400).send("Story must have at least one end.");
    }
    const endIds = new Set();
    for (const end of ends) {
      if (!end.endId || typeof end.endId !== "string") {
        return res.status(400).send("Each end must have a unique 'endId'.");
      }
      if (endIds.has(end.endId)) {
        return res.status(400).send(`Duplicate 'endId' found: ${end.endId}`);
      }
      endIds.add(end.endId);

      if (!validateLanguageFields(end.content)) {
        return res
          .status(400)
          .send("Each end must have 'en' and 'ms' translations for content.");
      }
      if (typeof end.endType !== "string" || end.endType.trim() === "") {
        return res.status(400).send("Each end must have a valid 'endType'.");
      }
    }

    const validNextSteps = new Set([...stepIds, ...endIds]);
    for (const step of steps) {
      for (const option of step.options) {
        if (!validNextSteps.has(option.nextStep)) {
          return res
            .status(400)
            .send(`Invalid 'nextStep' reference: ${option.nextStep}`);
        }
      }
    }

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

    // Validate language fields if they are being updated
    if (updates.title && !validateLanguageFields(updates.title)) {
      return res
        .status(400)
        .send("Title must have both 'en' and 'ms' translations.");
    }
    if (updates.description && !validateLanguageFields(updates.description)) {
      return res
        .status(400)
        .send("Description must have both 'en' and 'ms' translations.");
    }

    // Validate steps if they are being updated
    if (updates.steps) {
      if (!Array.isArray(updates.steps) || updates.steps.length === 0) {
        return res.status(400).send("Story must have at least one step.");
      }
      for (const step of updates.steps) {
        if (!validateLanguageFields(step.content)) {
          return res
            .status(400)
            .send(
              "Each step must have 'en' and 'ms' translations for content."
            );
        }
        if (!Array.isArray(step.options) || step.options.length === 0) {
          return res
            .status(400)
            .send("Each step must have at least one option.");
        }
        for (const option of step.options) {
          if (!validateLanguageFields(option.optionText)) {
            return res
              .status(400)
              .send(
                "Each option must have 'en' and 'ms' translations for optionText."
              );
          }
          if (
            typeof option.nextStep !== "string" ||
            option.nextStep.trim() === ""
          ) {
            return res
              .status(400)
              .send("Each option must have a valid 'nextStep' identifier.");
          }
        }
      }
    }

    // Validate ends if they are being updated
    if (updates.ends) {
      if (!Array.isArray(updates.ends) || updates.ends.length === 0) {
        return res.status(400).send("Story must have at least one end.");
      }
      for (const end of updates.ends) {
        if (!validateLanguageFields(end.content)) {
          return res
            .status(400)
            .send("Each end must have 'en' and 'ms' translations for content.");
        }
        if (typeof end.endType !== "string" || end.endType.trim() === "") {
          return res.status(400).send("Each end must have a valid 'endType'.");
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
