import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UpdateDoctor(props) {
  const [formData, setFormData] = useState({
    DoctorName: props.doctor.DoctorName,
    Specialization: props.doctor.Specialization,
    DoctorContact: props.doctor.DoctorContact,
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
    if (!formData.DoctorName || !formData.Specialization || !formData.DoctorContact) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Generate a temporary patientId (ensure uniqueness in production)
      let tempDoctorId = Math.floor(Math.random() * 90000) + 10000;
      const response = await fetch(`http://localhost:5000/doctor/${props.doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData}),
      });

      if (!response.ok) {
        // const errorData = await response.json();
        toast.error('Failed to update doctor');
        throw new Error('Failed to update doctor');
      }

      const data = await response.json();
      console.log("Doctor data submitted: ", data);

      toast.success('Doctor updated successfully!');
      props.refreshdoctors();
      props.onHide();

      setFormData({ DoctorName: '', Specialization: '', DoctorContact: '' });
    } catch (err) {
      setError('Error updating doctor: ' + err.message);
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
          Update {formData.DoctorName}'s Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="DoctorName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="DoctorName"
              value={formData.DoctorName}
              onChange={handleChange}
              required
              placeholder="Enter Name"
            />
          </Form.Group>

          <Form.Group controlId="Specialization">
            <Form.Label>Specialization</Form.Label>
            <Form.Control
              type="text"
              name="Specialization"
              value={formData.Specialization}
              onChange={handleChange}
              required
              placeholder="Enter Specialization"
            />
          </Form.Group>

          <Form.Group controlId="DoctorContact">
            <Form.Label>DoctorContact</Form.Label>
            <Form.Control
              type="text"
              name="DoctorContact"
              value={formData.DoctorContact}
              onChange={handleChange}
              required
              placeholder="Enter Doctor Email"
            />
          </Form.Group>

          <Button className="my-3" variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Update Doctor'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateDoctor;
