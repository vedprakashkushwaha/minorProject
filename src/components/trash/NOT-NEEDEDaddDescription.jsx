import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AddDescriptionMid from "../addDescription";
import AdminHeader from "./adminHeader";

class AddDescription extends Component {
  render() {
    return (
      <Container fluid={true}>
        {/* header */}
        <Row>
          <AdminHeader />
        </Row>

        {/* mid body */}
        <Row>
          <Col style={{ height: 700, marginTop: "5%" }}>
            <AddDescriptionMid />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AddDescription;
