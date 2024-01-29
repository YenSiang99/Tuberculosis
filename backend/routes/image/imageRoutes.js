const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dirName = path.join(__dirname, './uploads/');
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    cb(null, dirName);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// POST route for file upload
router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file.path); // The path where the file is saved
  // Send back the filename to the client
  res.json({ filename: req.file.filename });
});

// GET route to fetch the image
router.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, './uploads/', filename);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Read and send the image file
    res.sendFile(filePath);
  });
});

module.exports = router;
