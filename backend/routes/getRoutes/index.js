const express = require('express');
const fetchPatients = require('../../views/fetchPatient');
const fetchDoctors = require('../../views/fetchDoctor');
const Patient = require('../../models/patient');
const Doctor = require('../../models/doctors');
const Appointment = require('../../models/appointments');
const fetchAppointments = require('../../views/fetchAppoint');
const fetchTrends = require('../../views/fetchTrends');

const router = express.Router();

// Route to Fetch All Patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await fetchPatients();
    res.status(200).json(patients); // Sending the fetched data as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to Fetch All Dcotors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await fetchDoctors();
    res.status(200).json(doctors); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to Fetch All Appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await fetchAppointments();
    res.status(200).json(appointments); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/patient/search', async (req, res) => {
  try {
    const { query } = req.query; 

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search for matches in either name or email using a case-insensitive regex for Patients, Doctors, Appointments 
    const patients = await Patient.find({
      $or: [
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for patient', error: error.message });
  }
});

router.get('/doctor/search', async (req, res) => {
  try {
    const { query } = req.query; 

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    
    const doctors = await Doctor.find({
      $or: [
        { DoctorName: { $regex: query, $options: "i" } },
        { Specialization: { $regex: query, $options: "i" } },
        { DoctorContact: { $regex: query, $options: "i" } },
      ],
    });

    
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for patient', error: error.message });
  }
});


router.get('/appointment/search', async (req, res) => {
  try {
    const { query } = req.query; 

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    
    const appointment = await Appointment.find({
      $or: [
        { DoctorID: { $regex: query, $options: "i" } },
      ],
    });

  
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for appointment', error: error.message });
  }
});

router.get("/trends", async (req, res) => {
  try {
    const trends = await fetchTrends(); // Calling the fetchTrends function
    res.status(200).json(trends); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
