import React from "react";
import { Component } from "react";
import { Container, Row } from "react-bootstrap";
import "./styles.css";
import OrgList from "./orgAutoSearch";

class DataOverview extends Component {
  render() {
    return (
      <Container className="data-overview-container">
        <Row>
          <OrgList />
        </Row>
      </Container>
    );
  }
}

export default DataOverview;
