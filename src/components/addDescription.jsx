import React from "react";
import { Form, Col, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";

const IP = require("./ipconfig.js");

class AddDescriptionMid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organismName: [],
      loading: false,
      errOrg: ""
    };
  }

  async componentDidMount() {
    const url = "http://" + IP + ":8000/api.organism.name";
    const respose = await fetch(url);
    const data = await respose.json();
    this.setState({
      organismName: data["results"],
      loading: true
    });
  }

  checkName = () => {
    let currentName = document.getElementById("organismName").value;
    let flag = 0;

    this.state.organismName.forEach(name => {
      if (name === currentName) {
        flag = 1;
        this.setState({
          errOrg: currentName
        });
      }
    });

    if (flag) {
      document.getElementById("errAlert").hidden = false;
      document.getElementById("submit").hidden = true;
      document.getElementById("reset").hidden = true;
    } else {
      document.getElementById("errAlert").hidden = true;
      document.getElementById("submit").hidden = false;
      document.getElementById("reset").hidden = false;
    }
  };

  uploadPics = async () => {
    let oName = document.getElementById("organismName").value;

    for (let i = 1; i < 5; i++) {
      let pic = "pic" + i;
      let fName = document.getElementById(pic).value;
      if (fName !== "") {
        fName = fName.replace(/.*[\\]/, "");

        const data = new FormData();
        data.append("file", document.getElementById(pic).files[0]);

        var dirPath = oName + "/";

        await axios
          .post("http://" + IP + ":8000/upload", data, {
            headers: { path: dirPath }
          })
          .then(res => {
            console.log(res.statusText);
          });
      }
    }
  };

  render() {
    let orgDesc = "http://" + IP + ":8000/orgDesc";

    return (
      <Card className="add-new add-new-desc">
        <Card.Header as="h5">
          <center>Enter Organism's Description</center>
        </Card.Header>
        <Card.Body>
          <Alert id="errAlert" variant="danger" hidden>
            {this.state.errOrg} is already in our database. Please check your
            input.
          </Alert>
          <Form
            method="post"
            action={orgDesc}
            name="addOrgForm"
            id="addOrgForm"
          >
            <Form.Row>
              <Form.Group as={Col} controlId="orgName">
                <Form.Label>Organism Name</Form.Label>
                <Form.Control
                  name="organismName"
                  id="organismName"
                  type="text"
                  onChange={this.checkName}
                  placeholder="Enter Organism Name"
                  required
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="orgDesc">
                <Form.Label>Organism Type</Form.Label>
                <Form.Control
                  name="organismType"
                  id="organismType"
                  type="text"
                  ref={this.organismType}
                  placeholder="One line description for organism"
                  required
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="orgDesc">
                <Form.Label>Organism Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  className="no-resize"
                  ref={this.organismDesc}
                  name="organismDesc"
                  id="organismDesc"
                  required
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="browseBtn">
                <Form.Label>Browse Pictures</Form.Label>
                <br />
                <input
                  type="file"
                  name="pic1"
                  id="pic1"
                  className="browse-pic"
                ></input>
                <input
                  type="file"
                  name="pic2"
                  id="pic2"
                  className="browse-pic"
                ></input>
                <input
                  type="file"
                  name="pic3"
                  id="pic3"
                  className="browse-pic"
                ></input>
                <input
                  type="file"
                  name="pic4"
                  id="pic4"
                  className="browse-pic"
                ></input>
              </Form.Group>
            </Form.Row>
            <br />
            <Button
              variant="success"
              id="submit"
              type="submit"
              className="pro-can-btn"
              onClick={async () => {
                await this.uploadPics();
              }}
            >
              Proceed
            </Button>
            &nbsp;
            <Button
              variant="danger"
              type="Reset"
              id="reset"
              onClick={() => {
                window.location.href = "http://" + IP + ":3000/godMode";
              }}
              className="pro-can-btn"
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default AddDescriptionMid;
