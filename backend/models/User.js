// // models/User.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     // Common fields
//     profilePicture: { type: String, default: "" },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     roles: [{ type: String, enum: ["admin", "patient", "healthcare"] }],
//     group: {
//       type: String,
//       required: true,
//       enum: ["patient", "doctor", "nurse", "medical assistant"],
//     },
//     passwordResetToken: String,
//     passwordResetExpires: Date,

//     // Healthcare-specific fields
//     mcpId: String,

//     // Patient-specific fields
//     firstName: String,
//     lastName: String,
//     gender: { type: String, enum: ["male", "female", ""] },
//     phoneNumber: String,
//     country: String,
//     passportNumber: String,
//     nricNumber: String,
//     age: String,
//     careStatus: {
//       type: String,
//       enum: ["Continue VOTS", "Switch to DOTS", "Appointment to see doctor"],
//     },
//     diagnosis: { type: String, enum: ["SPPTB", "SNTB", "EXPTB", "LTBI"] },
//     currentTreatment: {
//       type: String,
//       enum: ["Akurit-4", "Akurit", "Pyridoxine10mg"],
//     },
//     numberOfTablets: Number,
//     diagnosisDate: Date,
//     treatmentStartDate: Date,
//     treatmentDuration: Number,
//     videoUploadAlert: Boolean,
//     reminderTime: Date,
//     reminderFrequency: Number,
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", userSchema);

// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Common fields
    profilePicture: { type: String, default: "" },
    email: { type: String, unique: true, sparse: true }, // No longer required, unique with sparse index
    password: { type: String, required: true }, // Always required
    roles: [{ type: String, enum: ["admin", "patient", "healthcare", "user"] }],
    group: {
      type: String,
      required: true,
      enum: ["patient", "doctor", "nurse", "medical assistant", "user"],
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Healthcare-specific fields
    mcpId: String,

    // Patient-specific fields
    firstName: { type: String, required: false }, // Optional
    lastName: { type: String, required: false }, // Optional
    gender: { type: String, enum: ["male", "female", ""], required: false }, // Optional
    phoneNumber: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          // Phone number is required for 'patient' and 'user' groups
          if (["patient", "user"].includes(this.group)) {
            return value != null && value.trim().length > 0;
          }
          return true; // Not required for other user types
        },
        message: "Phone number is required for patients and users.",
      },
    },
    country: { type: String, required: false }, // Optional
    passportNumber: { type: String, required: false }, // Optional
    nricNumber: { type: String, required: false }, // Optional
    age: { type: String, required: false }, // Optional
    careStatus: {
      type: String,
      enum: ["Continue VOTS", "Switch to DOTS", "Appointment to see doctor"],
      required: false, // Optional
    },
    diagnosis: {
      type: String,
      enum: ["SPPTB", "SNTB", "EXPTB", "LTBI"],
      required: false, // Optional
    },
    currentTreatment: {
      type: String,
      enum: ["Akurit-4", "Akurit", "Pyridoxine10mg"],
      required: false, // Optional
    },
    numberOfTablets: { type: Number, required: false }, // Optional
    diagnosisDate: { type: Date, required: false }, // Optional
    treatmentStartDate: { type: Date, required: false }, // Optional
    treatmentDuration: { type: Number, required: false }, // Optional
    videoUploadAlert: { type: Boolean, required: false }, // Optional
    reminderTime: { type: Date, required: false }, // Optional
    reminderFrequency: { type: Number, required: false }, // Optional
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
