const express = require('express');
const addDoctor = require('../../views/addDoctor');
const addPatient = require('../../views/addPatient');
const addAppointment = require('../../views/addAppoint');
const Patient = require('../../models/patient');
const Doctor = require('../../models/doctors');

const router = express.Router();

// Route to Add a New Doctor
router.post('/doctors', async (req, res) => {
  try {
    
    const { DoctorID, DoctorName, Specialization, DoctorContact } = req.body;

    
    if (!DoctorID || !DoctorName || !Specialization || !DoctorContact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // To add the new doctor to the database
    const newDoctor = await addDoctor({
      DoctorID,
      DoctorName,
      Specialization,
      DoctorContact
    });

    
    res.status(201).json(newDoctor); 
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
});

// Route to Add a New Patient
router.post('/patients', async (req, res) => {
    try {
      
      const { patientId, firstname, lastname, email } = req.body;
      console.log(req.body);
      
      if (!patientId || !firstname || !lastname || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      
      const newPatient = await addPatient({
        patientId,
        firstname,
        lastname,
        email
      });
  
      
      res.status(201).json(newPatient); 
    } catch (err) {
        console.log(err.message);
      res.status(500).json({ error: err.message }); 
    }
  });

  // Route to Add a New Appointment
router.post('/appointments', async (req, res) => {
    try {
      
      const { AppointmentID, Date, Time, PatientID, DoctorID } = req.body;
      console.log(req.body);
      
      if (!AppointmentID || !Date || !Time || !PatientID ||!DoctorID) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      
      const newAppointment = await addAppointment({
        AppointmentID,
        DoctorID,
        Date,
        Time,
        PatientID,
        DoctorID
      });
  
      
      res.status(201).json(newAppointment); 
    } catch (err) {
        console.log(err.message);
      res.status(500).json({ error: err.message }); 
    }
  });


router.delete("/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
        
      
      const deletedPatient = await Patient.findByIdAndDelete(id);
  
      if (!deletedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      res.status(200).json({ message: "Patient deleted successfully", deletedPatient });
    } catch (error) {
      res.status(500).json({ message: "Error deleting patient", error: error.message });
    }
  });
  
  router.delete("/doctor/:id", async (req, res) => {
    try {
      const { id } = req.params;
        
      
      const deletedDoctor = await Doctor.findByIdAndDelete(id);
  
      if (!deletedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      res.status(200).json({ message: "Doctor deleted successfully", deletedDoctor });
    } catch (error) {
      res.status(500).json({ message: "Error deleting doctor", error: error.message });
    }
  });

  
  router.put("/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body; 
  
      
      const updatedPatient = await Patient.findByIdAndUpdate(id, updatedData, {
        new: true, 
        runValidators: true, 
      });
  
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      res.status(200).json(updatedPatient); 
    } catch (error) {
      res.status(500).json({ message: "Error updating patient", error: error.message });
    }
  });

    // Update a Doctor by ID
    router.put("/doctor/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updatedData = req.body; 
    
        
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, updatedData, {
          new: true, 
          runValidators: true, 
        });
    
        if (!updatedDoctor) {
          return res.status(404).json({ message: "Doctor not found" });
        }
    
        res.status(200).json(updatedDoctor); 
      } catch (error) {
        res.status(500).json({ message: "Error updating doctor", error: error.message });
      }
    });

module.exports = router;
