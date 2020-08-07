import React, { Component } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";

const IP = require("./ipconfig.js");

export class DeleteReplicon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replicons: [],
      originalReplicons: [],
      genomes: [],
      dispReplicons: []
    };
  }

  deleteReplicon = async event => {
    const data = new URLSearchParams();
    let index = event.target.id;

    data.append("aFile", this.state.originalReplicons[index]);
    data.append("gFile", this.state.genomes[index]);

    let aFiles = this.state.originalReplicons;
    let gFilesTemp = this.state.genomes;
    let gFiles = [];

    if (typeof gFilesTemp === "string") {
      gFiles = gFilesTemp.split(",");
      // gFiles.push(gFilesTemp);
    } else {
      gFiles = gFilesTemp;
    }

    aFiles.splice(index, 1);
    gFiles.splice(index, 1);

    let temp = [];
    aFiles.forEach(element => {
      temp.push(element.split(":")[0]);
    });

    await this.setState({
      originalReplicons: aFiles,
      genomes: gFiles,
      replicons: aFiles
    });

    data.append("aList", this.state.originalReplicons);
    data.append("gList", this.state.genomes);

    data.append("oName", this.props.orgname);

    await axios
      .post("http://" + IP + ":8000/deleteReplicon", data)
      .then(res => {});

    this.loadReplicons();
  };

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  async componentWillReceiveProps(nextProps) {
    const data = new URLSearchParams();

    data.append("oName", this.props.orgname);

    await axios.post("http://" + IP + ":8000/getReplicon", data).then(res => {
      if (res.data["results"][0] !== undefined) {
        let gFiles = res.data["results"][0]["genomefiles"];
        let temp = [];
        let filtered = [];

        temp = res.data["results"][0]["coll"];

        for (let i = 0; i < temp.length; i++) {
          filtered.push(temp[i].split(":")[0]);
        }

        this.setState({
          originalReplicons: temp,
          replicons: filtered,
          genomes: gFiles
        });
      }
    });

    this.loadReplicons();
  }

  loadReplicons = () => {
    let len = this.state.replicons.length;
    let comps = [];

    for (let i = 0; i < len; i++) {
      comps.push(
        <div key={i + 500}>
          <Row key={i + 100}>
            <Col key={i + 200}>
              <Form.Label key={i + 600}>{this.state.replicons[i]}</Form.Label>
            </Col>

            <Col key={i + 300}>
              <Button
                id={i}
                variant="danger"
                style={{ float: "right" }}
                onClick={this.deleteReplicon}
              >
                Delete
              </Button>
            </Col>
          </Row>
          <br />
        </div>
      );
    }

    this.setState({
      dispReplicons: comps
    });
  };

  delOrganism = async _name => {
    const data = new URLSearchParams();

    data.append("oName", this.props.orgname);

    await axios
      .post("http://" + IP + ":8000/deleteReplicon", data)
      .then(res => {
        console.log(res.statusText);
        document.getElementById("closeBtn").click();
      });
  };

  render() {
    if (this.state.replicons.length === 1) {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Deletion can not be performed
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              Please add more than one replicon to perform deletion. <br />
              To delete last replicon choose Delete Organism.
            </div>
          </Modal.Body>

          <Modal.Footer>These actions are irreversible</Modal.Footer>
        </Modal>
      );
    } else {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Choose Replicons to delete from {this.props.orgname}?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>{this.state.dispReplicons}</div>
          </Modal.Body>

          <Modal.Footer>These actions are irreversible</Modal.Footer>
        </Modal>
      );
    }
  }
}
