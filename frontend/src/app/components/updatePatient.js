import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UpdatePatient(props) {
  const [formData, setFormData] = useState({
    firstname: props.patient.firstname,
    lastname: props.patient.lastname,
    email: props.patient.email,
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
    if (!formData.firstname || !formData.lastname || !formData.email) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Generate a temporary patientId (ensure uniqueness in production)
      let tempPatientId = Math.floor(Math.random() * 90000) + 10000;
      const response = await fetch(`http://localhost:5000/patients/${props.patient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,patientId:tempPatientId}),
      });

      if (!response.ok) {
        // const errorData = await response.json();
        toast.error('Failed to add patient');
        throw new Error('Failed to add patient');
      }

      const data = await response.json();
      console.log("Patient data submitted: ", data);

      //setSuccessMessage('Patient added successfully!');
      toast.success('Patient added successfully!');
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
          Update {formData.firstname}'s Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstname">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              placeholder="Enter first name"
            />
          </Form.Group>

          <Form.Group controlId="lastname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              placeholder="Enter last name"
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </Form.Group>

          <Button className="my-3" variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Patient'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdatePatient;
