const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Common fields

    profilePicture: { type: String, default: "" },
    email: {
      type: String,
      unique: true,
      sparse: true, // This allows multiple null values
      required: function () {
        return ["admin", "healthcare", "patient"].includes(this.group);
      },
    },
    password: { type: String, required: true },
    roles: [{ type: String, enum: ["admin", "patient", "healthcare", "user"] }],
    group: {
      type: String,
      required: true,
      enum: ["patient", "doctor", "nurse", "medical assistant", "user"],
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

    // User identification - phone number is the primary identifier for 'user' group
    phoneNumber: {
      type: String,
      unique: true,
      required: function () {
        return ["patient", "user"].includes(this.group);
      },
      sparse: true, // This allows multiple null values
    },

    // Rest of your schema fields remain the same...
    mcpId: String,
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    gender: { type: String, enum: ["male", "female", ""], required: false },
    country: { type: String, required: false },
    passportNumber: { type: String, required: false },
    nricNumber: { type: String, required: false },
    age: { type: String, required: false },
    careStatus: {
      type: String,
      enum: ["Continue VOTS", "Switch to DOTS", "Appointment to see doctor"],
      required: false,
    },
    diagnosis: {
      type: String,
      enum: ["SPPTB", "SNTB", "EXPTB", "LTBI"],
      required: false,
    },
    currentTreatment: {
      type: String,
      enum: ["Akurit-4", "Akurit", "Pyridoxine10mg"],
      required: false,
    },
    numberOfTablets: { type: Number, required: false },
    diagnosisDate: { type: Date, required: false },
    treatmentStartDate: { type: Date, required: false },
    treatmentDuration: { type: Number, required: false },
    videoUploadAlert: { type: Boolean, required: false },
    reminderTime: { type: Date, required: false },
    reminderFrequency: { type: Number, required: false },
    refreshToken: {
      type: String,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
