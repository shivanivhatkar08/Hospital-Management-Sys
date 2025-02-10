require('dotenv').config();
const connectDB = require('../config/db'); // Import the database connection function
const Patient = require('../models/patient'); // Import the Patient model

// Add a new Patient to the database
const addPatient = async (patientData) => {
  try {
    console.log(patientData);
    // Connect to the database
    await connectDB(); // Ensure the connection happens only when needed

    // Create a new patient using the data from the request body
    const newPatient = new Patient({
      patientId: patientData.patientId,
      firstname: patientData.firstname,
      lastname: patientData.lastname,
      email: patientData.email
    });

    // Save the new patient to the database
    const savedPatient = await newPatient.save();

    return savedPatient; // Return the saved patient
  } catch (err) {
    console.log(err.message,"this error");
    throw new Error('Error adding patient: ' + err.message); // Throw error for route to handle
  }
};

module.exports = addPatient;