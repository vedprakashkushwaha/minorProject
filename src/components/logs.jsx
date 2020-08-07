import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const IP = require("./ipconfig.js");

export class Log extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: ""
    };
  }

  async componentDidUpdate() {
    await axios.post("http://" + IP + ":8000/logs").then(res => {
      console.log(res.data["results"]);
      this.setState({
        logs: res.data["results"]
      });
    });
  }

  download = async () => {
    window.open("http://" + IP + ":8000/downloadLog", "_blank");
  };

  clear = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Click OK to clear logs")) {
      await axios.post("http://" + IP + ":8000/clearLog").then(res => {
        // alert("logs cleared");
      });
      window.location.href = "http://" + IP + ":3000/godMode";
    } else {
      alert("logs are intact");
    }
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
            Admin Panel - Logs
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            as="textarea"
            rows="20"
            wrap="off"
            className="no-resize logs scrollbar"
            id="style-1"
            name="logs"
            value={this.state.logs}
            placeholder="Please wait while logs are being loaded..."
            disabled
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="warning"
            name="clearBtn"
            id="clearBtn"
            onClick={this.clear}
            style={{ color: "white" }}
          >
            Clear
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
