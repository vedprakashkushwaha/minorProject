import React, { Component } from "react";
import { Button, Row, Col, Card, Form, Image } from "react-bootstrap";
import "./styles.css";
import "bootstrap";
import axios from "axios";

const IP = require("./ipconfig.js");

class ContactUs extends Component {
  send = () => {
    const URLdata = new URLSearchParams();

    URLdata.append("email", document.getElementById("uname").value);
    URLdata.append("subject", document.getElementById("subject").value);
    URLdata.append("message", document.getElementById("message").value);

    axios.post("http://" + IP + ":8000/sendMail", URLdata).then(res => {
      alert("Feedback sent.");
    });
  };

  render() {
    return (
      <Row className="admin-row">
        <Col>
          <Card className="contact-us">
            <Card.Header as="h5" style={{ textAlign: "center" }}>
              Contact Us
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm="2">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/as/c/c8/Tezpur_University_logo.png"
                    height="150px"
                  />
                </Col>
                <Col sm="4">
                  <span className="contact-info" align="left">
                    <i className="fa fa-map-marker"></i>
                    &nbsp;&nbsp;&nbsp;Tezpur University <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Napaam, Tezpur Sonitpur
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Assam (India). Pin - 784
                    028
                    <br />
                    <br />
                    <i className="fa fa-globe"></i>
                    &nbsp;&nbsp;&nbsp;http://www.tezu.ernet.in
                    <br />
                    <br />
                    <i className="fa fa-fax"></i>
                    &nbsp;&nbsp;&nbsp;+91-3712-267-005 | 006
                    <br />
                    <i className="fa fa-phone"></i>
                    &nbsp;&nbsp;&nbsp;+91-3712-267-007 | 008 | 009 | 100
                    <br />
                    <br />
                  </span>
                </Col>
                <Col>
                  <iframe
                    title="TU Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.3801180131177!2d92.82857141543109!3d26.700300875628898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3744ebc8fd314411%3A0x28a60e3c5515613b!2sTezpur%20University!5e0!3m2!1sen!2sin!4v1575216546978!5m2!1sen!2sin"
                    width="100%"
                    height="230%"
                    frameborder="0"
                    allowfullscreen=""
                  ></iframe>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Row>
                    <Col sm="4">
                      <Card.Title>Your E-mail:</Card.Title>
                    </Col>
                    <Col sm="8">
                      <Form.Control
                        type="text"
                        id="uname"
                        placeholder="Enter your email id"
                        required
                      />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm="4">
                      <Card.Title>Subject</Card.Title>
                    </Col>
                    <Col sm="8">
                      <Form.Control
                        type="text"
                        id="subject"
                        placeholder="Enter subject"
                        required
                      />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm="4">
                      <Card.Title>Message</Card.Title>
                    </Col>
                    <Col sm="8">
                      <Form.Control
                        id="message"
                        className="no-resize"
                        as="textarea"
                        rows="3"
                        placeholder="Enter your message"
                        required
                      />
                    </Col>
                  </Row>
                  <br />
                  <Button
                    variant="success"
                    className="login-cancel-btn"
                    onClick={this.send}
                  >
                    Send
                  </Button>
                </Col>
                <Col></Col>
                <Col></Col>
              </Row>
              &nbsp;&nbsp;&nbsp;
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default ContactUs;
