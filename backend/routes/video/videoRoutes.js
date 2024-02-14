// routes/videoRoutes.js
const express = require('express');
const videoController = require('../../controllers/video/videoController');
const authenticate = require('../../middlewares/authenticate');
const { uploadVideo, uploadProfile } = require('../../middlewares/multerConfig');
const router = express.Router();

// Create
router.put('/getOrCreateVideo', authenticate, videoController.getOrCreateVideo);

// Read
router.get('/getVideo', authenticate, videoController.getVideo);
router.get('/getVideo/:videoId', authenticate, videoController.getVideo);
router.get('/getUsersTable', authenticate, videoController.getUsersTable);

// Update
router.post('/uploadVideo/:videoId', authenticate, uploadVideo, videoController.uploadVideo);
router.patch('/updateVideo/:videoId', authenticate, videoController.updateVideoStatus);

module.exports = router;

