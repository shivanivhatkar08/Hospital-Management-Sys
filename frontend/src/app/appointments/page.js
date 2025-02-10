// src/app/appointments/page.jsx
"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import AddAppointment from "../components/addAppointment";
import UpdateAppointment from "../components/updateAppointment";
import { toast } from "react-toastify";
import { format } from 'date-fns';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  //state to handle the filter search
  const [filteredappointments, setFilteredAppointments] = useState([]);
  //state to handle the regular appointments
  const [regularappointments, setRegularAppointments] = useState([]);
  const [update,setUpdate] = useState({isUpdate:false,appointment:{}});
  const [search,setSearch] = useState({isSearch:false,term:""});
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctor] = useState([]);

  // Fetch data from your API
  const fetchAppoinments = async () => {
    try {
      const response = await fetch('http://localhost:5000/appointments'); // Your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch appointment data');
      }
      const data = await response.json();
      setRegularAppointments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctors'); // Your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch doctor data');
      }
      const data = await response.json();
      let handleData = createDoctorOptions(data);
      setDoctor(handleData);
    } catch (err) {
        
    }
  };

  function createDoctorOptions(doctors) {
    const doctorOptions = doctors.map((doctor) => ({
      label: doctor.DoctorName,
      value: doctor.DoctorID,
    }));
  
    return doctorOptions;
  }

  const searchAppointments = (term) => {
    try {
      console.log(term,doctors);
      // Filter the local doctor state based on the search term
      const filteredDoctors = doctors.filter((doctor) =>
        doctor.label.toLowerCase().includes(term.toLowerCase())
      );
  console.log("doc",filteredDoctors,regularappointments);
      // Extract the IDs of the filtered doctors
      const doctorIds = filteredDoctors.map((doctor) => doctor.value);
      console.log("docss",doctorIds);
      // Filter the appointments that have a matching doctor ID
      let filteredAppointments = regularappointments.filter((appointment) =>
        doctorIds.includes(parseInt(appointment.DoctorID))
      );
      console.log("fille",filteredAppointments);
      // Update the local state with the filtered appointments
      setFilteredAppointments(filteredAppointments);
      setLoading(false); // Set loading to false after filtering
    } catch (err) {
      setError(err.message); // Update the error state
      setLoading(false);     // Set loading to false in case of an error
    }
  };

  const clearSearch = () =>{
    setSearch({isSearch:false,term:""});
    setAppointments(regularappointments);
  }

  const clearUpdate = () =>{
    setUpdate({isUpdate:false,appointment:{}});
  }

  const refreshAppointments = () => {
    fetchAppoinments();
  }

  const handleSearch = () =>{
    setSearch({...search,isSearch:true});
    searchAppointments(search.term);
  }

  const handleUpdate = (appointment) =>{
    setUpdate({appointment:appointment,isUpdate:true});
    console.log(appointment);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
  
    const formattedDate = format(date, 'dd-MM-yyyy'); // Formats date as dd-mm-yyyy
    return formattedDate;
  }
  function formatTime(timeString) {
    // Try parsing the time string using the Date constructor
    const time = new Date(timeString);
  
    // Check if the time is valid
    if (isNaN(time)) {
      return "Invalid time";  // Return a default string if time is invalid
    }
  
    // Format the time as hh:mm:ss AM/PM
    const formattedTime = format(time, "hh:mm:ss a");
  
    return formattedTime;
  }
  
 

  useEffect(() =>{
    fetchDoctors();
  },[])

  const fetchDoctorNameById= (id) => {
    const doctor = doctors.find((doctor) => doctor.value === id);
  // Return the doctor's name if found, otherwise return null or an appropriate fallback
    return doctor ? doctor.label : 'Jane';
  }
  const handleDelete = async (AppointmentID) => {
    try {
      // Make a DELETE request to the backend
      const response = await fetch(`http://localhost:5000/appointments/${AppointmentID}`, {
        method: "DELETE", // Specify the HTTP method as DELETE
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
  
      // Parse the response data (optional)
      const data = await response.json();
      console.log("Appointment deleted successfully:", data);
      fetchAppoinments();
  
      // Optional: Update the UI (e.g., remove the patient from the list)
      toast.success(`Appointment with ID ${AppointmentID} deleted successfully`);
    } catch (error) {
      console.error("Error deleting appointment:", error.message);
      toast.error(`Failed to delete appointment: ${error.message}`);
    }
  };

  // Fetch appointments data when component mounts
  useEffect(() => {
    fetchAppoinments();
  }, []);

  useEffect(()=>{
    if(search.isSearch){
      setAppointments(filteredappointments);
    }else{
      setAppointments(regularappointments);
    }
  },[search.isSearch,regularappointments,filteredappointments])

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
              placeholder="Search by Doctor Name"
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
          Make Appointment
        </Button>

        </Col>
 
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr key='t-head'>
              <th>#</th>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment._id}>
                <td>{index + 1}</td>
                <td>{appointment.Date}</td>
                <td>{appointment.Time}</td>
                <td>{fetchDoctorNameById(appointment.DoctorID)}</td>
                <td><Button className='mx-2' onClick={()=>handleUpdate(appointment)}>Update</Button><Button variant="danger" onClick={()=>handleDelete(appointment._id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <AddAppointment 
        show={modalShow}
        options = {doctors}
        onHide={() => setModalShow(false)} 
        refreshAppointments = {refreshAppointments}/>
        {
          update.isUpdate && (
            <UpdateAppointment
              show={update.isUpdate}
              appointment={update.appointment}
              onHide={() => clearUpdate()}
              refreshAppointments = {refreshAppointments}/>
          )
        }
    </Container>
  );
};

export default AppointmentsPage;
