require('dotenv').config();
const connectDB = require('../config/db'); // Import the database connection function
const Patient = require('../models/patient'); // Import the patient model
const Doctor = require('../models/doctors'); // Import the patient model

// Fetch Patients from Database
const fetchPatients = async () => {
  try {
    // Connect to the database
    await connectDB(); // Ensure the connection happens only when needed

    // Fetch all patients from the "patients" collection
    const patients = await Patient.find();

    return patients; // Return patients instead of logging and exiting
  } catch (err) {
    throw new Error('Error fetching patients: ' + err.message); // Throw error for route to handle
  }
};

module.exports = fetchPatients;
