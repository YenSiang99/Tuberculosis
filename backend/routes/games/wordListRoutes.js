const express = require("express");
const router = express.Router();
const wordListController = require("../../controllers/games/wordListController");

router.post("/", wordListController.createWordList);
router.get("/", wordListController.getWordLists);
router.put("/:id", wordListController.updateWordList);
router.delete("/:id", wordListController.deleteWordList);

router.get("/active", wordListController.getActiveWordList); // Route for fetching the active word list
router.get("/search", wordListController.getWordListByFields); // Generalized route for field-based searching

module.exports = router;
