const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: Number,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
    },
  }, 
  {
    timestamps: true,
    collection:"Patient"
  }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
