// routes/videoRoutes.js
const express = require('express');
const videoController = require('../../controllers/video/videoController');
const authenticate = require('../../middlewares/authenticate');
const { uploadVideo, uploadProfile } = require('../../middlewares/multerConfig');
const router = express.Router();



// Read
router.get('/getDailyUserVideo', authenticate, videoController.getDailyUserVideo);
router.get('/getVideo', authenticate, videoController.getVideo);
router.get('/getVideo/:videoId', authenticate, videoController.getVideo);
router.get('/getUsersTable', authenticate, videoController.getUsersTable);

// Update
router.post('/uploadVideo', authenticate, uploadVideo, videoController.uploadVideo);
router.patch('/updateVideo/:videoId', authenticate, videoController.updateVideoStatus);

// Test api to inject video for different dates
router.post('/uploadVideoForDates', authenticate, uploadVideo, videoController.uploadVideoForDates);


module.exports = router;

