const express = require("express");
const router = express.Router();
const storyController = require("../../controllers/games/storyController");

// Create
router.post("/", storyController.createStory);

// Read
router.get("/", storyController.getStories);
router.get("/active", storyController.getActiveStory);
router.get("/:id", storyController.getStoryById);

// Update
router.put("/:id", storyController.updateStory);

// Delete
router.delete("/:id", storyController.deleteStory);

module.exports = router;
