// controllers/videoController.js
const Video = require('../../models/Video');
const User = require('../../models/User');


exports.getVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const { year, month } = req.query; // Capture year and month from query params
    let userId = req.user.userId
    if (videoId) {
      // Fetch a single video by ID
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).send('Video not found');
      }
      return res.json(video);
    } else if (year && month) {
      // Fetch videos for the specified month and year
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // 0th day of the next month is the last day of the current month
      endDate.setHours(23, 59, 59, 999); // Include the end of the last day of the month

      const videos = await Video.find({
        date: {
          $gte: startDate,
          $lte: endDate
        },
        patient: userId
      });
      res.json(videos);
    } else {
      // Fetch all videos for the current day if no year and month are specified

      const videos = await Video.find({});
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

exports.getDailyUserVideo = async (req, res) => {
  try {
    // console.log('User : ', req.user)
    const userId = req.user.userId; // Assuming this is set from the authentication middleware
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the current day

    let video = await Video.findOne({
      patient: userId,
      date: { $gte: today }
    });

    // if (!video) {
    //   // console.log('Video not created for the day, creating video with status pending approval')
    //   // No video for today, create a new record
    //   video = new Video({
    //     patient: userId,
    //     doctor: req.body.doctorId, // This needs to come from somewhere
    //     status: 'pending upload for today',
    //     date: new Date() // Today's date
    //   });
    //   await video.save();
    // }else{
    //   // console.log('Video created, returning video data...')
    // }

    res.json(video);
  } catch (error) {
    res.status(500).send('Error checking or creating video: ' + error.message);
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    let video = await Video.findOne({
      patient: userId,
      date: { $gte: today }
    });

    if (!video) {
      // If no video exists for today, create a new record
      video = new Video({
        patient: userId,
        date: new Date()
      });
    }
    if (req.file) {
      // Update or set the video URL and status
      video.videoUrl = `${process.env.BASE_URL}/media/videos/${req.file.filename}`;
      video.status = 'pending approval';
      await video.save();
      res.status(200).json(video);
    } else {
      // If no file is provided in the request
      res.status(400).send('No video file provided');
    }
  } catch (error) {
    res.status(500).send('Error uploading video: ' + error.message);
  }
};

exports.uploadVideoForDates = async (req, res) => {
  const userId = req.user.userId;
  const { year, month } = req.query;
  
  if (!year || !month) {
    return res.status(400).json({ message: "Year and month are required as query parameters." });
  }

  // Retrieve the patient's diagnosis date
  const patient = await User.findById(userId);
  if (!patient || !patient.diagnosisDate) {
    return res.status(404).json({ message: "Patient not found or diagnosis date is missing." });
  }
  const diagnosisDate = new Date(patient.diagnosisDate);

  const videoUrl = `${process.env.BASE_URL}/media/videos/${req.file.filename}`;

  // Calculate the range of dates for the specified month and year
  const startDate = new Date(Date.UTC(year, month - 1, 1)); // Use UTC date for start of month
  const currentDate = new Date();
  const currentUTCDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
  const endDate = currentUTCDate.getFullYear() === +year && currentUTCDate.getMonth() + 1 === +month ? currentUTCDate : new Date(Date.UTC(year, month, 0)); // Last day of specified month in UTC

  let date = new Date(startDate.getTime());
  let videoRecords = []
  while (date <= endDate) {
    // Ensure date is on or after the diagnosis date
    if (date >= diagnosisDate) {
      const videoExists = await Video.findOne({
        patient: userId,
        date: {
          $gte: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)),
          $lt: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999))
        }
      });

      if (!videoExists) {
        const videoData = {
          videoUrl,
          patient: userId,
          date: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)), // Use start of day in UTC
          status: 'pending approval'
        };
        
        const video = new Video(videoData);
        await video.save();
        videoRecords.push(video);
      }
    }
    
    // Move to the next day
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0)); // Move to next day in UTC
  }

  if (videoRecords.length > 0) {
    res.status(201).json(videoRecords);
  } else {
    res.status(200).json({ message: "No new video records were created. They either already exist or are before the diagnosis date." });
  }
};









