// src/app/patients/page.jsx
"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import AddPatient from "../components/addPatient";
import UpdatePatient from "../components/updatePatient";
import { toast } from "react-toastify";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  //state to handle the filter search
  const [filteredspatients, setFilteredsPatients] = useState([]);
  //state to handle the regular patients
  const [regularpatients, setRegularPatients] = useState([]);
  const [search,setSearch] = useState({isSearch:false,term:""});
  const [update,setUpdate] = useState({isUpdate:false,patient:{}});
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from your API
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/patients'); // Your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
      const data = await response.json();
      setRegularPatients(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const searchPatients = async (term) => {
    try {
      const response = await fetch(`http://localhost:5000/patient/search?query=${term}`); // Use the new search endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
  
      const data = await response.json();
      setFilteredsPatients(data); // Update the state with the filtered patients
      setLoading(false);         // Set loading to false after the data is fetched
    } catch (err) {
      setError(err.message);      // Update the error state
      setLoading(false);          // Set loading to false in case of error
    }
  };

  const clearSearch = () =>{
    setSearch({isSearch:false,term:""});
    setPatients(regularpatients);
  }

  const clearUpdate = () =>{
    setUpdate({isUpdate:false,patient:{}});
  }

  const refreshPatients = () => {
    fetchPatients();
  }

  const handleSearch = () =>{
    setSearch({...search,isSearch:true});
    searchPatients(search.term);
  }

  const handleUpdate = (patient) =>{
    setUpdate({patient:patient,isUpdate:true});
    console.log(patient);
  }

  useEffect(()=>{
    if(search.isSearch){
      setPatients(filteredspatients);
    }else{
      setPatients(regularpatients);
    }
  },[search.isSearch,regularpatients,filteredspatients])


  const handleDelete = async (patientId) => {
    try {
      // Make a DELETE request to the backend
      const response = await fetch(`http://localhost:5000/patients/${patientId}`, {
        method: "DELETE", // Specify the HTTP method as DELETE
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }
  
      // Parse the response data (optional)
      const data = await response.json();
      console.log("Patient deleted successfully:", data);
      fetchPatients();
  
      // Optional: Update the UI (e.g., remove the patient from the list)
      toast.success(`Patient ${data.deletedPatient.firstname} deleted successfully`);
    } catch (error) {
      console.error("Error deleting patient:", error.message);
      toast.error(`Failed to delete patient: ${error.message}`);
    }
  };

  // Fetch patients data when component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="top-head">
      <Row className="my-4">
        <Col>
          <Form.Group controlId="firstname">
            <Form.Control
              type="text"
              name="search"
              value={search.term}
              onChange={(e)=>setSearch({...search,term:e.target.value})}
              required
              placeholder="Search by Name / Email"
            />
          </Form.Group>
        </Col>
        <Col>
        {
          search.isSearch ? (
            <Button variant="danger" name="clear" onClick={()=>clearSearch()}>Clear</Button>
          ):(
            <Button name="search" onClick={()=>handleSearch()} disabled={search.term === ""}>Search</Button>
          )
        }
        <Button className="mx-4" variant="primary" onClick={() => setModalShow(true)}>
          Add Patient
        </Button>
        </Col>
 
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr key='t-head'>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient._id}> {/* Assuming _id is unique */}
                <td>{index + 1}</td> {/* Display the index + 1 for the row number */}
                <td>{patient.firstname}</td>
                <td>{patient.lastname}</td>
                <td>{patient.email}</td>
                <td>
                  <Button className="mx-3" onClick={()=>handleUpdate(patient)}>Update</Button>
                  <Button variant="danger" onClick={()=>handleDelete(patient._id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <AddPatient 
        show={modalShow}
        onHide={() => setModalShow(false)} 
        refreshPatients = {refreshPatients}/>
        {
          update.isUpdate && (
            <UpdatePatient
              show={update.isUpdate}
              patient={update.patient}
              onHide={() => clearUpdate()}
              refreshPatients = {refreshPatients}/>
          )
        }
    </Container>
  );
};

export default PatientsPage;
