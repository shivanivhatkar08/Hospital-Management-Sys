// src/app/doctors/page.jsx
"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import AddDoctor from "../components/addDoctor";
import UpdateDoctor from "../components/updateDoctor";
import { toast } from "react-toastify";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filtereddoctors, setFilteredDoctors] = useState([]);
  const [regulardoctors, setRegularDoctors] = useState([]);
  const [search,setSearch] = useState({isSearch:false,term:""});
  const [update,setUpdate] = useState({isUpdate:false,doctor:{}});
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from your API
  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctors'); // Your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch doctor data');
      }
      const data = await response.json();
      setRegularDoctors(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const searchDoctors = async (term) => {
    try {
      const response = await fetch(`http://localhost:5000/doctor/search?query=${term}`); // Use the new search endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch doctor data');
      }
  
      const data = await response.json();
      setFilteredDoctors(data); // Update the state with the filtered patients
      setLoading(false);         // Set loading to false after the data is fetched
    } catch (err) {
      setError(err.message);      // Update the error state
      setLoading(false);          // Set loading to false in case of error
    }
  };

  const clearSearch = () =>{
    setSearch({isSearch:false,term:""});
    setDoctors(regulardoctors);
  }

  const clearUpdate = () =>{
    setUpdate({isUpdate:false,doctor:{}});
  }

  const refreshDoctors = () => {
    fetchDoctors();
  }

  const handleSearch = () =>{
    setSearch({...search,isSearch:true});
    searchDoctors(search.term);
  }

  const handleUpdate = (doctor) =>{
    setUpdate({doctor:doctor,isUpdate:true});
    console.log(doctor);
  }

  const handleDelete = async (DoctorID) => {
    try {
      // Make a DELETE request to the backend
      const response = await fetch(`http://localhost:5000/doctor/${DoctorID}`, {
        method: "DELETE", // Specify the HTTP method as DELETE
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }
  
      // Parse the response data (optional)
      const data = await response.json();
      console.log("Doctor deleted successfully:", data);
      fetchDoctors();
  
      // Optional: Update the UI (e.g., remove the patient from the list)
      toast.success(`Doctor ${data.deletedDoctor.DoctorName} details is deleted successfully`);
    } catch (error) {
      console.error("Error deleting doctor:", error.message);
      toast.error(`Failed to delete doctor: ${error.message}`);
    }
  };

    // Fetch patients data when component mounts
    useEffect(() => {
      fetchDoctors();
    }, []);

  useEffect(()=>{
    if(search.isSearch){
      setDoctors(filtereddoctors);
    }else{
      setDoctors(regulardoctors);
    }
  },[search.isSearch,regulardoctors,filtereddoctors])

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
              placeholder="Search by Name / Specialization"
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
          Add Doctor
        </Button>
        </Col>

      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr key='t-head'>
              <th>#</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor._id}> {/* Assuming _id is unique */}
                <td>{index + 1}</td> {/* Display the index + 1 for the row number */}
                <td>{doctor.DoctorName}</td>
                <td>{doctor.Specialization}</td>
                <td>{doctor.DoctorContact}</td>
                <td>
                  <Button className="mx-3" onClick={()=>handleUpdate(doctor)}>Update</Button>
                  <Button variant="danger" onClick={()=>handleDelete(doctor._id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <AddDoctor 
        show={modalShow}
        onHide={() => setModalShow(false)} 
        refreshdoctors = {refreshDoctors}/>
        {
          update.isUpdate && (
            <UpdateDoctor
              show={update.isUpdate}
              doctor={update.doctor}
              onHide={() => clearUpdate()}
              refreshdoctors = {refreshDoctors}/>
          )
        }
    </Container>
  );
};

export default DoctorsPage;
