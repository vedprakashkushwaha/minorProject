import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./font-awesome/css/font-awesome.min.css";
import "./styles.css";

const IP = require("./ipconfig.js");

export class DownloadByLoc extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  download = async () => {
    let fName = this.props.gfile;

    fName = fName.split(":")[1];

    let path = this.props.org + "/" + fName;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let action = "";

    if (document.getElementById("forward").checked === true) {
      action = "forward";
    } else {
      action = "reverse";
    }
    window.location =
      "http://" +
      IP +
      ":8000/downloadByLoc/?path=" +
      path +
      "&start=" +
      start +
      "&end=" +
      end +
      "&action=" +
      action;

    this.props.onHide();
  };

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Download genome sequence specified by location
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Start Location</Form.Label>
              <Form.Control
                id="start"
                type="text"
                placeholder="1"
                pattern="[0-9]*"
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>End Location</Form.Label>
              <Form.Control
                id="end"
                type="text"
                placeholder="9999"
                pattern="[0-9]*"
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Order: </Form.Label>
              &nbsp;&nbsp;&nbsp;
              <Form.Check
                type="radio"
                label="Forward"
                name="formHorizontalRadios"
                id="forward"
                defaultChecked
              />
              <Form.Check
                type="radio"
                label="Complement"
                name="formHorizontalRadios"
                id="reverse"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            name="closeBtn"
            id="closeBtn"
            onClick={this.props.onHide}
          >
            Close
          </Button>
          <Button
            variant="success"
            name="downloadBtn"
            id="downloadBtn"
            onClick={this.download}
          >
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
