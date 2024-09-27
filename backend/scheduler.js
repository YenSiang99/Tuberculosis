//scheduler.js
const cron = require("node-cron");
const User = require("./models/User"); // Adjust path as necessary
const Video = require("./models/Video");
const Notification = require("./models/Notification");

async function remindPatientsToUploadVideo() {
  // console.log('Reminder function called');
  try {
    const now = new Date();
    const patients = await User.find({
      roles: "patient",
      videoUploadAlert: true,
    });

    for (const patient of patients) {
      const reminderTime = new Date(patient.reminderTime);
      let diff = now - reminderTime;
      const timeElapsedSinceReminder = Math.floor(diff / 1000 / 60);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const videoUploadedToday = await Video.findOne({
        patient: patient._id,
        date: { $gte: today },
      });

      let toRemind =
        timeElapsedSinceReminder % patient.reminderFrequency === 0 &&
        !videoUploadedToday
          ? true
          : false;
      // console.log(
      //   `Patient ID: ${patient._id}, Time diff: ${timeElapsedSinceReminder}, To remind: ${toRemind}`
      // );

      if (toRemind) {
        const message = `Reminder: Please upload your daily video.`;
        const notification = new Notification({
          recipient: patient._id,
          message,
          targetUrl: "/patient/video",
        });
        await notification.save();
        console.log(`Notification saved for patient ID: ${patient._id}`);
      }
    }
  } catch (error) {
    console.error("Error in remindPatientsToUploadVideo:", error);
  }
}

// Run the reminder check every minute
cron.schedule("* * * * *", remindPatientsToUploadVideo);

console.log("Scheduler for sending reminders is running.");

module.exports = {
  remindPatientsToUploadVideo, // Exporting in case you need to invoke it manually or for testing
};
