// controllers/videoController.js
const Video = require('../../models/Video');
const upload = require('../../middlewares/multerConfig');


exports.getVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    if (videoId) {
      // Fetch a single video by ID
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).send('Video not found');
      }
      return res.json(video);
    } else {
      // Fetch all videos for the current day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const videos = await Video.find({ date: { $gte: today } });
      res.json(videos);
    }
  } catch (error) {
    res.status(500).send('Error retrieving videos: ' + error.message);
  }
};

exports.getUsersTable = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch videos with "pending approval" status and populate patient details
    const videos = await Video.find({
      date: { $gte: today },
      status: { $in: ["pending approval", "approved", "rejected"] } // Filter by status
    }).populate('patient', 'firstName lastName profilePicture'); 

    const videosWithPatientDetails = videos.map(video => {
      const videoObject = video.toObject();
      // Construct a new object with the desired structure, including the patient's profile picture
      return {
        ...videoObject,
        patientName: `${videoObject.patient.firstName} ${videoObject.patient.lastName}`,
        profilePicture: videoObject.patient.profilePicture,
        patient: undefined // Optionally remove the patient object to clean up the data
      };
    });

    res.json(videosWithPatientDetails);
  } catch (error) {
    res.status(500).send('Error retrieving videos Table: ' + error.message);
  }
};

exports.updateVideoStatus = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const { status } = req.body;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    video.status = status;
    video.lastActionBy = userId;
    await video.save();

    res.status(200).send(video);
  } catch (error) {
    res.status(500).send('Error updating video status: ' + error.message);
  }
};

exports.getOrCreateVideo = async (req, res) => {
  try {
    // console.log('User : ', req.user)
    const userId = req.user.userId; // Assuming this is set from the authentication middleware
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the current day

    let video = await Video.findOne({
      patient: userId,
      date: { $gte: today }
    });

    if (!video) {
      // console.log('Video not created for the day, creating video with status pending approval')
      // No video for today, create a new record
      video = new Video({
        patient: userId,
        doctor: req.body.doctorId, // This needs to come from somewhere
        status: 'pending upload',
        date: new Date() // Today's date
      });
      await video.save();
    }else{
      // console.log('Video created, returning video data...')
    }

    res.json(video);
  } catch (error) {
    res.status(500).send('Error checking or creating video: ' + error.message);
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    if (req.file) {
      video.videoUrl = `${process.env.BASE_URL}/media/videos/${req.file.filename}`;
      video.status = 'pending approval';
      await video.save();
      res.status(200).send(video);
    } else {
      res.status(400).send('No video file provided');
    }
  } catch (error) {
    res.status(500).send('Error uploading video: ' + error.message);
  }
};





