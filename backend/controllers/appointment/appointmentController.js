// controllers/appointmentController.js
const Appointment = require("../../models/Appointment");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

const moment = require("moment-timezone");

const {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDay,
  formatISO,
  startOfDay,
} = require("date-fns");

// Create
exports.createAppointment = async (req, res) => {
  const { startDateTime, endDateTime } = req.body;
  const patientId = req.user.userId;

  try {
    const newAppointment = new Appointment({
      patient: patientId,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
    });
    await newAppointment.save();

    const patient = await User.findById(patientId);
    const healthcareStaff = await User.find({ roles: "healthcare" });
    // Format startDateTime in UTC or a specific timezone, e.g., 'Asia/Kuala_Lumpur'
    const formattedStartDateTime = moment(startDateTime)
      .tz("UTC")
      .format("YYYY-MM-DD hh:mm A"); // Adjust timezone as needed

    healthcareStaff.forEach(async (staff) => {
      const notification = new Notification({
        recipient: staff._id,
        message: `${patient.firstName} ${patient.lastName} has made an appointment for ${formattedStartDateTime}.`,
        targetUrl: "/healthcare/appointment",
      });
      await notification.save();
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
exports.updateAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const healthcareId = req.user.userId;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "awaiting approval") {
      return res
        .status(400)
        .json({ message: "Appointment is not in an approvable state" });
    }

    appointment.status = status;
    appointment.healthcare = healthcareId; // Assuming this means the healthcare provider is taking action on the appointment
    await appointment.save();

    // Send notification to the patient about the status update
    const patient = await User.findById(appointment.patient);
    const healthcareProvider = await User.findById(healthcareId);
    const formattedStartDateTime = moment(appointment.startDateTime)
      .tz("UTC")
      .format("YYYY-MM-DD hh:mm A");

    let message = `Your appointment scheduled for ${formattedStartDateTime} has been ${status} by ${healthcareProvider.firstName} ${healthcareProvider.lastName}.`;

    const notification = new Notification({
      recipient: appointment.patient,
      message: message,
      targetUrl: "/patientappointment", // Adjust this URL to where patients view their appointments
    });
    await notification.save();

    res.json(appointment);
  } catch (error) {
    console.error("Error in updating appointment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Read
// Available Slots
// Show Available Slots with Confirmed Bookings Excluded
exports.showAvailableSlots = async (req, res) => {
  const { year, month } = req.query; // Expecting year and month in the query parameters
  const startOfTheMonth = new Date(year, month - 1, 1);
  const endOfTheMonth = endOfMonth(startOfTheMonth);

  const validDaysOfWeek = [1, 3, 5]; // Monday, Wednesday, Friday
  const slots = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  try {
    let daysWithSlots = [];

    eachDayOfInterval({ start: startOfTheMonth, end: endOfTheMonth }).forEach(
      (day) => {
        if (validDaysOfWeek.includes(getDay(day))) {
          // Filters out days that are not Mon, Wed, or Fri
          const daySlots = slots.map((slot) => {
            const startDateTime = new Date(
              `${formatISO(day, { representation: "date" })}T${slot}:00.000Z`
            );
            const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Adds 30 minutes to startDateTime
            return { startDateTime, endDateTime };
          });

          daysWithSlots.push({
            day: day,
            availableTimeSlotList: daySlots,
          });
        }
      }
    );

    // Fetch booked, awaiting approval, and confirmed (approved) slots from the database for the month
    const excludedStatuses = ["booked", "awaiting approval", "approved"]; // Include "approved" status to exclude confirmed appointments
    const bookedSlots = await Appointment.find(
      {
        status: { $in: excludedStatuses },
        startDateTime: { $gte: startOfTheMonth },
        endDateTime: { $lte: endOfTheMonth },
      },
      "startDateTime endDateTime"
    );

    // Update available slots and status for each day
    daysWithSlots = daysWithSlots.map((daySlot) => {
      const availableTimeSlotList = daySlot.availableTimeSlotList.filter(
        (availableSlot) => {
          return !bookedSlots.some((bookedSlot) => {
            return (
              bookedSlot.startDateTime.getTime() ===
              availableSlot.startDateTime.getTime()
            );
          });
        }
      );

      let status = "Available";
      if (availableTimeSlotList.length === 0) {
        status = "Fully Booked";
      } else if (availableTimeSlotList.length <= 3) {
        status = "Limited Slots";
      }

      return {
        day:
          formatISO(startOfDay(daySlot.day), { representation: "date" }) +
          "T00:00:00.000Z",
        status,
        availableTimeSlotList: availableTimeSlotList.map((slot) => ({
          startDateTime: slot.startDateTime.toISOString(),
          endDateTime: slot.endDateTime.toISOString(),
        })),
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
    const appointments = await Appointment.find({
      patient: patientId,
    }).populate("healthcare", "firstName lastName"); // Include the healthcare provider's name
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Doctor
exports.showRequestedAppointments = async (req, res) => {
  try {
    let appointments = await Appointment.find({ status: "awaiting approval" })
      .populate("patient", "firstName lastName")
      .populate("healthcare", "firstName lastName");
    appointments = appointments.map((appointment) => {
      const appointmentObj = appointment.toObject(); // Convert to plain JavaScript object
      if (appointmentObj.patient) {
        const fullName = `${appointmentObj.patient.firstName} ${appointmentObj.patient.lastName}`;
        // Add fullName directly to the appointmentObj, not nested under patient
        appointmentObj.fullName = fullName;
      }

      return appointmentObj;
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.readHealthcareAppointments = async (req, res) => {
  const healthcareId = req.user.userId;
  try {
    let appointments = await Appointment.find({
      healthcare: healthcareId,
    }).populate("patient", "firstName lastName");
    appointments = appointments.map((appointment) => {
      const appointmentObj = appointment.toObject(); // Convert to plain JavaScript object
      if (appointmentObj.patient) {
        const fullName = `${appointmentObj.patient.firstName} ${appointmentObj.patient.lastName}`;
        // Add fullName directly to the appointmentObj, not nested under patient
        appointmentObj.fullName = fullName;
      }

      return appointmentObj;
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
exports.deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.userId;

  try {
    const appointment = await Appointment.findById(appointmentId);
    const user = await User.findById(userId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Assuming roles are set correctly in your User model
    const isPatient = user.roles.includes("patient");
    let notificationMessage = "";
    let targetUrl = "";

    if (isPatient) {
      // If a patient is deleting the appointment, notify healthcare staff
      notificationMessage = `Patient ${user.firstName} ${user.lastName} has cancelled the appointment.`;
      targetUrl = "/healthcare/appointment";
      // Assuming you have a mechanism to fetch all healthcare staff IDs
      const healthcareStaff = await User.find({ roles: "healthcare" });
      healthcareStaff.forEach(async (staff) => {
        const notification = new Notification({
          recipient: staff._id,
          message: notificationMessage,
          targetUrl,
        });
        await notification.save();
      });
    } else {
      // If healthcare staff is deleting the appointment, notify the patient
      notificationMessage = `Your appointment has been cancelled by healthcare stuff.`;
      targetUrl = "/patientappointment";
      const notification = new Notification({
        recipient: appointment.patient,
        message: notificationMessage,
        targetUrl,
      });
      await notification.save();
    }

    await Appointment.deleteOne({ _id: appointmentId });
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error in deleting appointment:", error);
    res.status(500).json({ message: error.message });
  }
};
