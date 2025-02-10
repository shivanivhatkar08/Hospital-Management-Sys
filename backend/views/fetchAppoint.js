require('dotenv').config();
const connectDB = require('../config/db'); // Import the database connection function
const Appointments  = require('../models/appointments'); // Import the patient model

// Fetch Patients from Database
const fetchAppointments = async () => {
  try {
    // Connect to the database
    await connectDB(); // Ensure the connection happens only when needed

    // Fetch all patients from the "patients" collection
    const appointments = await Appointments.find();

    return appointments; // Return patients instead of logging and exiting
  } catch (err) {
    throw new Error('Error fetching Appointments: ' + err.message); // Throw error for route to handle
  }
};

module.exports = fetchAppointments;
