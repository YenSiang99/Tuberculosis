// controllers/wordListController.js

const WordList = require("../../models/games/WordListModel");

// Utility function to validate multilingual fields
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

// Create Word List
exports.createWordList = async (req, res) => {
  try {
    const { name, words, description, totalGameTime } = req.body;

    // Validate that `name` has both 'en' and 'ms' translations
    if (!validateLanguageFields(name)) {
      return res
        .status(400)
        .send("Name must have both 'en' and 'ms' translations.");
    }

    // Validate `description` if provided
    if (description && !validateLanguageFields(description)) {
      return res
        .status(400)
        .send("Description must have both 'en' and 'ms' translations.");
    }

    // Validate that `words` is a non-empty array
    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).send("Words must be a non-empty array.");
    }

    // Validate each word has 'en' and 'ms' translations
    for (const word of words) {
      if (!validateLanguageFields(word)) {
        return res
          .status(400)
          .send("Each word must have 'en' and 'ms' translations.");
      }
    }

    // Check if any word list exists in the database
    const existingWordListCount = await WordList.countDocuments();
    let isActive = false;

    if (existingWordListCount === 0) {
      // If this is the first word list, set it as active
      isActive = true;
    }

    // Create new word list
    const newWordList = new WordList({
      name,
      words,
      description,
      totalGameTime,
      active: isActive,
    });

    await newWordList.save();

    res.status(201).send(newWordList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get all Word Lists
exports.getWordLists = async (req, res) => {
  try {
    const wordLists = await WordList.find({});
    res.status(200).send(wordLists);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get Word List by ID
exports.getWordListById = async (req, res) => {
  try {
    const wordListId = req.params.id;

    const wordList = await WordList.findById(wordListId);

    if (!wordList) {
      return res.status(404).send("Word list not found.");
    }

    res.status(200).send(wordList);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get Active Word List
exports.getActiveWordList = async (req, res) => {
  try {
    const activeWordList = await WordList.findOne({ active: true });

    if (!activeWordList) {
      return res.status(404).send("Active word list not found.");
    }

    res.status(200).send(activeWordList);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update Word List
exports.updateWordList = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate allowed updates
    const allowedUpdates = [
      "name",
      "words",
      "description",
      "active",
      "totalGameTime",
    ];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    // Validate fields if they are being updated
    if (updates.name && !validateLanguageFields(updates.name)) {
      return res
        .status(400)
        .send("Name must have both 'en' and 'ms' translations.");
    }
    if (updates.description && !validateLanguageFields(updates.description)) {
      return res
        .status(400)
        .send("Description must have both 'en' and 'ms' translations.");
    }
    if (updates.words) {
      if (!Array.isArray(updates.words) || updates.words.length === 0) {
        return res.status(400).send("Words must be a non-empty array.");
      }
      for (const word of updates.words) {
        if (!validateLanguageFields(word)) {
          return res
            .status(400)
            .send("Each word must have 'en' and 'ms' translations.");
        }
      }
    }

    // Find the word list to update
    const wordList = await WordList.findById(id);

    if (!wordList) {
      return res.status(404).send("Word list not found.");
    }

    // Handle active status updates
    if ("active" in updates) {
      if (wordList.active && updates.active === false) {
        // Prevent deactivating the only active word list
        return res
          .status(400)
          .send({ error: "Cannot deactivate the active word list." });
      } else if (!wordList.active && updates.active === true) {
        // Deactivate other active word lists
        await WordList.updateMany({ active: true }, { active: false });
      }
    }

    // Update the word list with allowed updates
    Object.assign(wordList, updates);

    await wordList.save();

    res.send(wordList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete Word List
exports.deleteWordList = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the word list to delete
    const wordList = await WordList.findById(id);

    if (!wordList) {
      return res.status(404).send("Word list not found.");
    }

    // Prevent deletion of active word list
    if (wordList.active) {
      return res
        .status(400)
        .send({ error: "Cannot delete an active word list." });
    }

    await wordList.remove();
    res.send({ message: "Word list deleted successfully." });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
