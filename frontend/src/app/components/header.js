// components/NavBar.js
"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Nav } from "react-bootstrap";

const NavBar = () => {
    const [path,setPath] = useState("/")
 useEffect(()=>{
    console.log(window.location.pathname);
setPath(window.location.pathname)
 },[window.location.pathname])

  return (
    <Navbar className={"nav-head p-4"} bg="light" expand="lg" sticky>
      <Navbar.Brand href="/">Hospital Management System</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Item>
            
              <Nav.Link className={path === "/patients" ? "active" :""} href="/patients" >Patients</Nav.Link>
            
          </Nav.Item>
          <Nav.Item>
          <Nav.Link className={path === "/doctors" ? "active" :""} href="/doctors" >Doctors</Nav.Link>
          </Nav.Item>
          <Nav.Item>
          <Nav.Link className={path === "/appointments" ? "active" :""} href="/appointments" >Appointments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
          <Nav.Link className={path === "/trends" ? "active" :""} href="/trends" >Trends</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
