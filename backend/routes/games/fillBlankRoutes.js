const express = require("express");
const router = express.Router();
const fillBlankController = require("../../controllers/games/fillBlankController");

// Create
router.post("/", fillBlankController.createFillBlank);

// Read
router.get("/", fillBlankController.getFillBlanks);
router.get("/:id", fillBlankController.getFillBlankById);

// Update
router.put("/:id", fillBlankController.updateFillBlank);

// Delete
router.delete("/:id", fillBlankController.deleteFillBlank);

module.exports = router;
