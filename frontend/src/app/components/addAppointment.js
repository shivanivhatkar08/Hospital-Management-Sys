import { Button, Form, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Select from 'react-select';

function AddAppointment(props) {
  const [formData, setFormData] = useState({
    Date: '',
    Time: '',
    PatientID: 318,
    DoctorID: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedDoctor,setSelectedDoctor] = useState();
  // Handle form input changes
  const handleChange = (e) => {
    console.log("this is change",e.value)
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDoctor = (e) => {
    setSelectedDoctor(e);
    setFormData((prevData) => ({
      ...prevData,
      "DoctorID": e.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    console.log(formData);
    // Validate form fields
    if (!formData.Date || !formData.Time || !formData.PatientID || !formData.DoctorID) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Generate a temporary patientId (ensure uniqueness in production)
      let tempAppointmentId = Math.floor(Math.random() * 90000) + 10000;
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,AppointmentID:tempAppointmentId}),
      });

      if (!response.ok) {
        // const errorData = await response.json();
        toast.error('Failed to make appointment');
        throw new Error('Failed to make appointment');
      }

      const data = await response.json();
      console.log("Appointment is Successful: ", data);

      //setSuccessMessage('Patient added successfully!');
      toast.success('Appointment is Successful!');
      props.refreshPatients();
      props.onHide();

      setFormData({ firstname: '', lastname: '', email: '' });
    } catch (err) {
      setError('Error adding patient: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Make Appointment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="Date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="Date"
              value={formData.Date}
              onChange={handleChange}
              required
              placeholder="Enter date"
            />
          </Form.Group>

          <Form.Group controlId="Time">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="Time"
              value={formData.Time}
              onChange={handleChange}
              required
              placeholder="Enter time"
            />
          </Form.Group>

          {/* <Form.Group controlId="patientId">
            <Form.Label>patient Id</Form.Label>
            <Form.Control
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              placeholder="Enter patient ID"
            />
          </Form.Group> */}

          <Form.Group controlId="DoctorID">
            <Form.Label>Doctor</Form.Label>
            {/* <Form.Control
              type="text"
              name="DoctorID"
              value={formData.DoctorID}
              onChange={handleChange}
              required
              placeholder="Enter patient ID"
            /> */}
            <Select name="DoctorID" value={selectedDoctor} 
            options={props.options} onChange={handleDoctor}/>
          </Form.Group>

          <Button className="my-4" variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Make Appointment'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddAppointment;
