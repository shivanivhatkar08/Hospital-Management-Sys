require('dotenv').config();
const connectDB = require('../config/db'); // Import the database connection function
const Appointment = require('../models/appointments');
const Patient = require('../models/appointments'); // Import the Patient model

// Add a new Patient to the database
const addAppoint = async (appointmentData) => {
  try {
    console.log(appointmentData);
    // Connect to the database
    await connectDB(); // Ensure the connection happens only when needed

    // Create a new patient using the data from the request body
    const newPatient = new Appointment({
      AppointmentID: appointmentData.AppointmentID,
      Date: appointmentData.Date,
      Time: appointmentData.Time,
      patientId: appointmentData.PatientID,
      DoctorID: appointmentData.DoctorID
    });

    // Save the new patient to the database
    const savedAppointment = await newPatient.save();

    return savedAppointment; // Return the saved patient
  } catch (err) {
    console.log(err.message,"this error");
    throw new Error('Error making Appointment: ' + err.message); // Throw error for route to handle
  }
};

module.exports = addAppoint;