import React, { Component } from "react";
import Logo from "./logo";
import { Button, Row, Col, Container, Card, Form } from "react-bootstrap";
import "./styles.css";
import "bootstrap";

class Graph extends Component {
  render() {
    return (
      <Container fluid={true}>
        {/* header */}
        <Row>
          <Col>
            <Logo />
          </Col>

          <Col className="d-flex flex-column"></Col>
        </Row>

        {/* mid body */}
        <Row>
          <Col>
            <Card className="admin-login">
              <Card.Header as="h5">
                <center>Admin Login Panel</center>
              </Card.Header>
              <Card.Body>
                <Card.Title>Username</Card.Title>
                <Form.Control type="text" placeholder="Enter username" />
                <br />
                <Card.Title>Password</Card.Title>
                <Form.Control
                  type="text"
                  className="umm"
                  id="adminPass"
                  placeholder="**********"
                />
                <br />
                <Button variant="danger" className="login-cancel-btn">
                  Cancel
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="success" href="/admin">
                  Sign in
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* footer */}
        <Row>
          <Col style={{ height: 100 }}>{/* <AddNew /> */}</Col>
        </Row>
      </Container>
    );
  }
}

export default Graph;
