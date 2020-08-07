import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import NavDropdown from "react-bootstrap/NavDropdown";

class AdminHeader extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" style={{ width: "100%" }}>
        <Navbar.Brand href="#home">ADMIN PANEL</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/addNewOrganism">Add New Organism</Nav.Link>
          <Nav.Link href="#features">Remove Organism </Nav.Link>

          <NavDropdown title="Add Merged File" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Ecoli</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Picoli</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Update" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Ecoli</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Picoli</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form inline>
          <FormControl
            type="text"
            placeholder="Search Organism"
            className="mr-sm-1"
            style={{ width: "70%" }}
          />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Navbar>
    );
  }
}

export default AdminHeader;
