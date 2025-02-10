import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddDoctor(props) {

    const [formData, setFormData] = useState({
        DoctorName: '',
        Specialization: '',
        DoctorContact: '',
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
            let tempDocId = Math.floor(Math.random() * 900) + 100;
            const response = await fetch('http://localhost:5000/doctors', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formData,DoctorID:tempDocId}),
              });
        
              if (!response.ok) {
                toast.error('Failed to add doctor');
                throw new Error('Failed to add doctor');
              }
        
            const data = await response.json();
            console.log("Doctor data submitted: ", formData);
    
            // For now, just simulate a success response
            // setSuccessMessage('Doctor added successfully!');
            toast.success('Doctor added successfully!');
            props.refreshdoctors();
            props.onHide();

            setFormData({ DoctorName: '', Specialization: '', DoctorContact: '' });
        } catch (err) {
          setError('Error adding doctor: ' + err.message);
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
            Add Doctor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="DoctorName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="DoctorName"
              value={formData.DoctorName}
              onChange={handleChange}
              required
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
            />
          </Form.Group>

          <Form.Group controlId="DoctorContact">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="DoctorContact"
              value={formData.DoctorContact}
              onChange={handleChange}
              required
            />
          </Form.Group> 
          <Button className="my-3" variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Doctor'}
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
    );
  }

  export default AddDoctor;