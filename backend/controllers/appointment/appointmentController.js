// controllers/appointmentController.js
const Appointment = require('../../models/Appointment');
const { eachDayOfInterval, startOfMonth, endOfMonth, getDay, formatISO, startOfDay  } = require('date-fns');

// Create
exports.createAppointment = async (req, res) => {
  const { startDateTime, endDateTime } = req.body; // Expecting startDate and endDate in the request
  const patient = req.user.userId;

  try {
    const newAppointment = new Appointment({
      patient,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update
exports.updateAppointment = async (req, res) => {
  const { appointmentId } = req.params; 
  const { status } = req.body; 
  const healthcare = req.user.userId; 

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.status !== 'awaiting approval') {
      return res.status(400).json({ message: 'Appointment is not in an approvable state' });
    }
    appointment.healthcare = healthcare;
    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read
// Available Slots
exports.showAvailableSlots = async (req, res) => {
  const { year, month } = req.query; // Expecting year and month in the query parameters
  const startOfTheMonth = new Date(year, month - 1, 1);
  const endOfTheMonth = endOfMonth(startOfTheMonth);

  const validDaysOfWeek = [1, 3, 5]; // Monday, Wednesday, Friday
  const slots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  try {
    let daysWithSlots = [];

    eachDayOfInterval({ start: startOfTheMonth, end: endOfTheMonth }).forEach(day => {
      if (validDaysOfWeek.includes(getDay(day))) { // Filters out days that are not Mon, Wed, or Fri
        const daySlots = slots.map(slot => {
          const startDateTime = new Date(`${formatISO(day, { representation: 'date' })}T${slot}:00.000Z`);
          const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Adds 30 minutes to startDateTime
          return { startDateTime, endDateTime };
        });

        daysWithSlots.push({
          day: day,
          availableTimeSlotList: daySlots,
        });
      }
    });

    // Fetch booked or awaiting approval slots from the database for the month
    const bookedSlots = await Appointment.find({
      $or: [{ status: "booked" }, { status: "awaiting approval" }],
      startDateTime: { $gte: startOfTheMonth },
      endDateTime: { $lte: endOfTheMonth }
    }, 'startDateTime endDateTime');

    // Update available slots and status for each day
    daysWithSlots = daysWithSlots.map(daySlot => {
      const availableTimeSlotList = daySlot.availableTimeSlotList.filter(availableSlot => {
        return !bookedSlots.some(bookedSlot => {
          return bookedSlot.startDateTime.getTime() === availableSlot.startDateTime.getTime();
        });
      });
  
      let status = "Available";
      const bookedCount = 6 - availableTimeSlotList.length;
      if (bookedCount === 6) {
        status = "Fully Booked";
      } else if (bookedCount >= 3) {
        status = "Limited Slots";
      }
  
      // Correcting the day property to accurately reflect the start of the day
      return {
        // Ensure the 'day' represents the start of the day in the correct time zone
        day: formatISO(startOfDay(daySlot.day), { representation: 'date' }) + "T00:00:00.000Z",
        status,
        availableTimeSlotList: availableTimeSlotList.map(slot => ({
          startDateTime: slot.startDateTime.toISOString(),
          endDateTime: slot.endDateTime.toISOString()
        }))
      };
    });

    res.status(200).json(daysWithSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient
exports.readPatientAppointments = async (req, res) => {
  const patientId = req.user.userId;
  try {
    const appointments = await Appointment.find({ patient: patientId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Doctor
exports.showRequestedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'awaiting approval' })
                                          .populate('patient', 'firstName lastName')
                                          .populate('healthcare',  'firstName lastName' );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.readHealthcareAppointments = async (req, res) => {
  const healthcareId = req.user.userId;
  try {
    const appointments = await Appointment.find({ healthcare: healthcareId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
exports.deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.userId;

  console.log('appointmentId',appointmentId)

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the user is the patient who booked the appointment or the healthcare provider assigned to it
    // Assumes appointment.patient and appointment.healthcare are storing user IDs
    // Adjust field names as per your Appointment model
    if (appointment.patient.toString() !== userId && (!appointment.healthcare || appointment.healthcare.toString() !== userId)) {
      return res.status(403).json({ message: 'You are not authorized to delete this appointment' });
    }

    // Authorized to delete the appointment
    await Appointment.deleteOne({ _id: appointmentId });
    res.json({ message: 'Appointment deleted successfully' });

    // Note: No need to explicitly call fetchAvailableSlots and fetchPatientAppointments here
    // as those actions would be triggered from the client-side upon successful deletion.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
