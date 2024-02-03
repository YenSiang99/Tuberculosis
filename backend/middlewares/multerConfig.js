const multer = require('multer');
const path = require('path');

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/videos/'); // Adjust the destination folder for videos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/profiles/'); // Adjust the destination folder for profile pictures
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Multer upload functions
const uploadVideo = multer({ storage: videoStorage }).single('video');
const uploadProfile = multer({ storage: profileStorage }).single('profilePicture');

module.exports = { uploadVideo, uploadProfile };