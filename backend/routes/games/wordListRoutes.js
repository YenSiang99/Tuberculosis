const express = require("express");
const router = express.Router();
const wordListController = require("../../controllers/games/wordListController");

// Create a new word list
router.post("/", wordListController.createWordList);

// Get the active word list (optionally filtered by language)
router.get("/active", wordListController.getActiveWordList);

// Search word lists by fields
router.get("/search", wordListController.getWordListByFields);

// Get all word lists (optionally filtered by language)
router.get("/", wordListController.getWordLists);

// Get a word list by ID (optionally filtered by language)
router.get("/:id", wordListController.getWordListById);

// Update a word list by ID
router.put("/:id", wordListController.updateWordList);

// Delete a word list by ID
router.delete("/:id", wordListController.deleteWordList);

module.exports = router;
