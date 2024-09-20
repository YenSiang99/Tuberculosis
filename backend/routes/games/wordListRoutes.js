const express = require("express");
const router = express.Router();
const wordListController = require("../../controllers/games/wordListController");

// Create
router.post("/", wordListController.createWordList);

// Read
router.get("/", wordListController.getWordLists);
router.get("/:id", wordListController.getWordListById);

// Update
router.put("/:id", wordListController.updateWordList);

// Delete
router.delete("/:id", wordListController.deleteWordList);

// Additional
router.get("/active", wordListController.getActiveWordList); // Route for fetching the active word list
router.get("/search", wordListController.getWordListByFields); // Generalized route for field-based searching

module.exports = router;
