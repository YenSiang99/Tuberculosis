const WordList = require("../../models/games/WordListModel");

// controllers/WordListController.js

exports.createWordList = async (req, res) => {
  try {
    const { name, words, description, totalGameTime } = req.body;

    // Validate that words is a non-empty object with at least one language
    if (
      !words ||
      typeof words !== "object" ||
      Object.keys(words).length === 0
    ) {
      return res
        .status(400)
        .send("Words must be provided for at least one language.");
    }

    // Ensure that words for each language is an array of strings
    for (const [lang, wordArray] of Object.entries(words)) {
      if (!Array.isArray(wordArray)) {
        return res
          .status(400)
          .send(`Words for language '${lang}' must be an array.`);
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

exports.getWordLists = async (req, res) => {
  try {
    const wordLists = await WordList.find({});
    res.status(200).send(wordLists);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getWordListById = async (req, res) => {
  try {
    const wordListId = req.params.id;
    const { language } = req.query;

    const wordList = await WordList.findById(wordListId);

    if (!wordList) {
      return res.status(404).send("Word list not found.");
    }

    let responseWordList = wordList.toObject();

    if (language) {
      responseWordList.words = {
        [language]: wordList.words.get(language) || [],
      };
    }

    res.status(200).send(responseWordList);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getActiveWordList = async (req, res) => {
  try {
    const { language } = req.query;

    const activeWordList = await WordList.findOne({ active: true });

    if (!activeWordList) {
      return res.status(404).send("Active word list not found.");
    }

    // If language is specified, return words only for that language
    let responseWordList = activeWordList.toObject();

    if (language) {
      responseWordList.words = {
        [language]: activeWordList.words.get(language) || [],
      };
    }

    res.status(200).send(responseWordList);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// future purposes individual field filtering api ?
exports.getWordListByFields = async (req, res) => {
  try {
    const filter = req.query; // All query parameters become filters
    const wordLists = await WordList.find(filter);
    if (!wordLists.length) {
      return res.status(404).send("No word lists found matching the criteria.");
    }
    res.status(200).send(wordLists);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
    if ("words" in updates) {
      // Merge existing words with updates
      for (const [lang, wordArray] of Object.entries(updates.words)) {
        if (!Array.isArray(wordArray)) {
          return res
            .status(400)
            .send(`Words for language '${lang}' must be an array.`);
        }
        wordList.words.set(lang, wordArray);
      }
    }

    for (const key of updateKeys) {
      if (key !== "words") {
        wordList[key] = updates[key];
      }
    }

    await wordList.save();

    res.send(wordList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

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
    res.send(wordList);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
