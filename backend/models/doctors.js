const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    DoctorID: {
      type: Number,
      required: true,
      unique: true,
    },
    DoctorName: {
      type: String,  // The firstname is a string
      required: true,
    },
    Specialization: {
      type: String,  // The firstname is a string
      required: true,
    },
    DoctorContact: {
      type: String,  // The email is a string
      required: true,
      unique: true,  // Ensure that the email is unique
      match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'], // Validate email format
    },
  }, 
  {
    timestamps: true,
    collection:"Doctors"
  }
);

const Doctor = mongoose.model("Doctors", doctorSchema);

module.exports = Doctor;
