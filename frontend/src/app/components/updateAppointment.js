import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UpdateAppointment(props) {
  const [formData, setFormData] = useState({
    Date: props.appointment.Date,
    Time: props.appointment.Time,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validate form fields
    if (!formData.Date || !formData.Time) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Generate a temporary patientId (ensure uniqueness in production)
      let tempAppointmentId = Math.floor(Math.random() * 90000) + 10000;
      const response = await fetch(`http://localhost:5000/appointments/${props.appointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,AppointmentID:tempAppointmentId}),
      });

      if (!response.ok) {
        // const errorData = await response.json();
        toast.error('Failed to update appointment');
        throw new Error('Failed to update appointment');
      }

      const data = await response.json();
      console.log("appointment data submitted: ", data);

      //setSuccessMessage('Patient added successfully!');
      toast.success('appointment added successfully!');
      props.refreshPatients();
      props.onHide();

      setFormData({ Date: '', Time: ''});
    } catch (err) {
      setError('Error updating appointment: ' + err.message);
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
          Update Appointment
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
              placeholder="Enter Time"
            />
          </Form.Group>

          <Button className="my-3" variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Appointment'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateAppointment;
