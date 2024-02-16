const Video = require('../../models/Video'); // Adjust the path as necessary
const User = require('../../models/User');
const { startOfMonth, endOfMonth, differenceInCalendarDays, startOfDay, isBefore, endOfDay, parseISO, format, isEqual } = require('date-fns');

exports.progressTracker = async (req, res) => {
  const { year, month } = req.query; // Expecting year and month as query parameters
  const patientId = req.user.userId; // Assuming authentication middleware sets `req.user`

  try {
    // Fetch patient data to get diagnosisDate
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    const diagnosisDate = new Date(patient.diagnosisDate);
    const startDateOfMonth = startOfMonth(new Date(year, month - 1));
    const endDateOfMonth = endOfMonth(new Date(year, month - 1));
    const today = new Date();
    const currentDate = today > endDateOfMonth ? endDateOfMonth : startOfDay(today); // Use today's date or the end of the month, whichever comes first

    // Use the later of the diagnosisDate or the start of the month as the effective start date
    const effectiveStartDate = diagnosisDate > startDateOfMonth ? diagnosisDate : startDateOfMonth;

    // Find all videos uploaded by the patient in the given month and after the diagnosisDate
    const videos = await Video.find({
      patient: patientId,
      date: { $gte: effectiveStartDate, $lte: endDateOfMonth }
    });

    // Calculate the total number of days from effectiveStartDate to the end of the month
    const totalDaysInMonth = differenceInCalendarDays(endDateOfMonth, effectiveStartDate) + 1;
    const totalDaysUpToToday = differenceInCalendarDays(currentDate, effectiveStartDate) + 1;

    // Calculate the number of days with uploaded videos
    const uploadedDays = new Set(videos.map(video => format(video.date, 'yyyy-MM-dd'))).size;

    // Calculate the overall completion percentage based on the effective start date
    const overallCompletionPercentage = (uploadedDays / totalDaysInMonth) * 100;

    // Calculate the relative completion percentage (up to today)
    const uploadedDaysUpToToday = videos.filter(video =>
      isBefore(parseISO(format(video.date, 'yyyy-MM-dd')), endOfDay(currentDate)) ||
      isEqual(parseISO(format(video.date, 'yyyy-MM-dd')), currentDate)
    ).length;
    const relativeCompletionPercentage = (uploadedDaysUpToToday / totalDaysUpToToday) * 100;

    res.json({
      diagnosisDate: patient.diagnosisDate,
      overallCompletionPercentage: overallCompletionPercentage.toFixed(2), // Round to two decimal places for readability
      relativeCompletionPercentage: relativeCompletionPercentage.toFixed(2),
      uploadedDays: uploadedDays,
      totalDaysInMonth: totalDaysInMonth,
      uploadedDaysUpToToday: uploadedDaysUpToToday,
      totalDaysUpToToday: totalDaysUpToToday,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving progress tracker information", error: error.message });
  }
};


