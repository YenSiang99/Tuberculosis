const WordList = require("../../models/games/WordListModel");

exports.createWordList = async (req, res) => {
  try {
    const { name, words, description, totalGameTime } = req.body;

    // Find and deactivate currently active word list
    const activeWordList = await WordList.findOne({ active: true });
    if (activeWordList) {
      activeWordList.active = false;
      await activeWordList.save();
    }

    // Create new word list and set it as active
    const newWordList = new WordList({
      name,
      words,
      description,
      totalGameTime, // Include the total game time
      active: true, // Set the new word list as active
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
    const wordList = await WordList.findById(wordListId);

    if (!wordList) {
      return res.status(404).send("Word list not found.");
    }

    res.status(200).send(wordList);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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

// exports.updateWordList = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const wordList = await WordList.findByIdAndUpdate(id, updates, {
//       new: true,
//     });
//     if (!wordList) {
//       return res.status(404).send("Word list not found.");
//     }
//     res.send(wordList);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

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

    const wordList = await WordList.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!wordList) {
      return res.status(404).send("Word list not found.");
    }
    res.send(wordList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteWordList = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await WordList.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Word list not found.");
    }
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
