import React, { Component } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";

const IP = require("./ipconfig.js");

export class ChangeAdminPass extends Component {
  updatePass = async () => {
    const data = new URLSearchParams();

    let oldPass = document.getElementById("oldPass").value;
    let newPass = document.getElementById("newPass").value;

    data.append("oldPass", oldPass);
    data.append("newPass", newPass);

    await axios.post("http://" + IP + ":8000/updatePass", data).then(res => {
      console.log(res.statusText);

      if (res.data["results"] !== "OK") {
        document.getElementById("errAlert").hidden = false;
      } else {
        const cookies = new Cookies();
        cookies.remove("uName");
        cookies.remove("uPass");

        document.getElementById("closeBtn").click();

        window.location.href = "http://" + IP + ":3000/login";
      }
    });
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
            Admin Panel - Password Manager
          </Modal.Title>
        </Modal.Header>
        <center>
          <Alert variant="danger" id="errAlert" hidden>
            You entered wrong Old Password
          </Alert>
        </center>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="text"
              id="oldPass"
              className="umm"
              placeholder="**********"
            />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="text"
              id="newPass"
              className="umm"
              placeholder="**********"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="info"
            name="closeBtn"
            id="closeBtn"
            onClick={this.props.onHide}
          >
            Close
          </Button>
          <Button
            variant="success"
            name="updateBtn"
            id="updateBtn"
            onClick={this.updatePass}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
