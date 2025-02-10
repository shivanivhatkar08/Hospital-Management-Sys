require('dotenv').config();
const connectDB = require('../config/db'); // Import the database connection function
const Doctor = require('../models/doctors'); // Import the Doctor model

// Add a new Doctor to the database
const addDoctor = async (doctorData) => {
  try {
    console.log(doctorData);
    // Connect to the database
    await connectDB(); // Ensure the connection happens only when needed

    // Create a new doctor using the data from the request body
    const newDoctor = new Doctor({
      DoctorID: doctorData.DoctorID,
      DoctorName: doctorData.DoctorName,
      Specialization: doctorData.Specialization,
      DoctorContact: doctorData.DoctorContact
    });

    // Save the new doctor to the database
    const savedDoctor = await newDoctor.save();

    return savedDoctor; // Return the saved doctor
  } catch (err) {
    console.log(err);
    throw new Error('Error adding doctor: ' + err.message); // Throw error for route to handle
  }
};

module.exports = addDoctor;
