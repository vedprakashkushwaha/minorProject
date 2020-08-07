import React, { Component } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";

const IP = require("./ipconfig.js");

export class DeleteOrg extends Component {
  delOrganism = async () => {
    const data = new URLSearchParams();

    data.append("oName", this.props.orgname);

    await axios
      .post("http://" + IP + ":8000/deleteOrganism", data)
      .then(res => {
        console.log(res.statusText);
        document.getElementById("closeBtn").click();
        window.location.href = "http://" + IP + ":3000/godMode";
      });
  };

  check = () => {
    if (document.getElementById("delOName").value === this.props.orgname) {
      document.getElementById("deleteBtn").disabled = false;
    } else {
      document.getElementById("deleteBtn").disabled = true;
    }
  };

  componentDidUpdate() {
    if (document.getElementById("deleteBtn") !== null) {
      document.getElementById("deleteBtn").disabled = true;
    }
  }

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
            Do you want to delete {this.props.orgname}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            This will delete the organism as well as all its replicons. These
            actions are irreversible.
            <Row style={{ marginTop: "15px" }}>
              <Col>
                <Form.Label>
                  Please enter organism's name to delete it:
                </Form.Label>
              </Col>
              <Col>
                <Form.Control type="text" id="delOName" onChange={this.check} />
              </Col>
            </Row>
          </Form>
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
            variant="danger"
            name="deleteBtn"
            id="deleteBtn"
            onClick={this.delOrganism}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
