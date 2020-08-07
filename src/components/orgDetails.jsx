import React from "react";
import { Component } from "react";
import {
  Card,
  Button,
  ButtonGroup,
  Form,
  Col,
  Dropdown
} from "react-bootstrap";
import axios from "axios";
import "./styles.css";
import { DeleteOrg } from "./deleteOrgPopUp";
import { DeleteReplicon } from "./delReplicons";
import UpdateToast from "./updateToast";
import { UpdatePics } from "./updatePics";

const IP = require("./ipconfig.js");

class OrgDetails extends Component {
  constructor({ props }) {
    super(props);
    this.state = {
      delPopUpShow: false,
      delRepPopUpShow: false,
      updateToastShow: false,
      updatePicShow: false
    };
    OrgDetails.getDerivedStateFromProps = OrgDetails.getDerivedStateFromProps.bind(
      this
    );
  }

  componentDidMount() {
    document.getElementById("editBtn").disabled = true;
    document.getElementById("editPicBtn").disabled = true;
    document.getElementsByName("delBtn")[0].disabled = true;
    document.getElementsByName("viewBtn")[0].disabled = true;
    document.getElementsByName("updateBtn")[0].disabled = true;
    document.getElementsByName("addRemFileBtn")[0].disabled = true;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orgdesc) {
      this.enableAll();
      return;
    } else {
      if (document.getElementById("editBtn")) {
        this.disableAll();
      }
      return null;
    }
  }

  disableAll = () => {
    document.getElementById("editBtn").disabled = true;
    document.getElementById("editPicBtn").disabled = true;
    document.getElementsByName("delBtn")[0].disabled = true;
    document.getElementsByName("viewBtn")[0].disabled = true;
    document.getElementsByName("updateBtn")[0].disabled = true;
    document.getElementsByName("addRemFileBtn")[0].disabled = true;
  };

  enableAll = () => {
    document.getElementById("editBtn").disabled = false;
    document.getElementById("editPicBtn").disabled = false;
    document.getElementsByName("delBtn")[0].disabled = false;
    document.getElementsByName("viewBtn")[0].disabled = false;
    document.getElementsByName("updateBtn")[0].disabled = false;
    document.getElementsByName("addRemFileBtn")[0].disabled = false;
  };

  updateOrgDetails = async newData => {
    const data = new URLSearchParams();

    let newName = document.getElementById("organismName").value;
    let newType = document.getElementById("organismType").value;
    let newDesc = document.getElementById("organismDesc").value;

    data.append("oldName", this.props.orgname);
    data.append("newName", newName);
    data.append("newType", newType);
    data.append("newDesc", newDesc);

    await axios
      .post("http://" + IP + ":8000/updateOrganism", data)
      .then(res => {
        console.log(res.statusText);
        this.loadupdateToast();

        document.getElementById("organismName").value = newName;
        document.getElementById("organismType").value = newType;
        document.getElementById("organismDesc").value = newDesc;
      });
  };

  componentDidUpdate() {
    document.getElementById("organismName").value = this.props.orgname;
    document.getElementById("organismType").value = this.props.orgtype;
    document.getElementById("organismDesc").value = this.props.orgdesc;
  }

  getText = event => {
    let text = event.target.value;
    event.target.value = text;
  };

  showInfo = event => {
    if (event.target.id !== "") {
      window.open(
        "http://" + IP + ":3000/?orgName=" + event.target.id,
        "_blank"
      );
    }
  };

  addNewFile = event => {
    if (event.target.id !== "") {
      window.open(
        "http://" + IP + ":3000/godMode?orgName=" + event.target.id,
        "_self"
      );
    }
  };

  // open pop-up for deleting organism
  loadDelPopUp() {
    this.setState({ delPopUpShow: true });
  }

  // open pop-up for deleting replicon
  loadDelRepPopUp() {
    this.setState({ delRepPopUpShow: true });
  }

  // open update toast
  loadupdateToast() {
    this.setState({ updateToastShow: true });
  }

  // open update pic pop-up
  loadupdatePic() {
    this.setState({ updatePicShow: true });
  }

  render() {
    let delPopUpClose = () => this.setState({ delPopUpShow: false });
    let delRepPopUpClose = () => this.setState({ delRepPopUpShow: false });
    let updateToastClose = () => this.setState({ updateToastShow: false });
    let updatePicClose = () => this.setState({ updatePicShow: false });

    let updateOrganism = "http://" + IP + ":8000/updateOrganism";

    return (
      <div>
        <div className="update-toast">
          <UpdateToast
            className="update-toast"
            show={this.state.updateToastShow}
            onHide={updateToastClose}
          />
        </div>
        <Card className="org-details">
          <Card.Header className="overview-header">
            <center>Details of {this.props.orgname}</center>
          </Card.Header>

          <Card.Body>
            <Form
              method="post"
              action={updateOrganism}
              name="updateOrgForm"
              id="updateOrgForm"
            >
              <Form.Row>
                <Form.Group as={Col} controlId="orgName">
                  <Form.Label>Organism Name</Form.Label>
                  <Form.Control
                    name="organismName"
                    id="organismName"
                    type="text"
                    // value={this.props.orgname}
                    onChange={this.getText}
                    placeholder="Choose an organism first"
                    disabled
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
                    // value={this.props.orgtype}
                    onChange={this.getText}
                    placeholder="Choose an organism first"
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="orgDesc">
                  <Form.Label>Organism Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="8"
                    className="no-resize"
                    name="organismDesc"
                    // value={this.props.orgdesc}
                    onChange={this.getText}
                    id="organismDesc"
                    placeholder="Choose an organism first"
                    required
                  />
                </Form.Group>
              </Form.Row>
            </Form>
          </Card.Body>

          <Button
            className="mt-1 square-corner"
            variant="info"
            name="viewBtn"
            id={this.props.orgname}
            onClick={this.showInfo}
            block
          >
            Organism HomePage
          </Button>
          <ButtonGroup className="mt-1 d-flex">
            <Button
              type="submit"
              className="square-corner"
              name="updateBtn"
              onClick={this.updateOrgDetails}
              id="editBtn"
            >
              Update Info
            </Button>

            <Button
              type="submit"
              className="square-corner"
              name="updatePicBtn"
              onClick={() => this.loadupdatePic({})}
              id="editPicBtn"
            >
              Update Pictures
            </Button>

            <Dropdown>
              <Dropdown.Toggle
                name="addRemFileBtn"
                className="square-corner"
                variant="primary"
                id="dropdown-basic"
              >
                Modify Replicons
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  id={this.props.orgname}
                  name="add"
                  onClick={this.addNewFile}
                >
                  Add New Replicon
                </Dropdown.Item>
                <Dropdown.Item
                  id="del"
                  name="del"
                  onClick={() => this.loadDelRepPopUp({})}
                >
                  Remove Existing Replicon
                </Dropdown.Item>
              </Dropdown.Menu>
              <DeleteReplicon
                show={this.state.delRepPopUpShow}
                onHide={delRepPopUpClose}
                orgname={this.props.orgname}
              />
              <UpdatePics
                show={this.state.updatePicShow}
                onHide={updatePicClose}
                orgname={this.props.orgname}
                images={this.props.orgimages}
              />
            </Dropdown>

            <Button
              className="square-corner"
              name="delBtn"
              id="delBtn"
              onClick={() => this.loadDelPopUp({})}
            >
              Delete
            </Button>
            <DeleteOrg
              show={this.state.delPopUpShow}
              onHide={delPopUpClose}
              orgname={this.props.orgname}
            />
          </ButtonGroup>
        </Card>
      </div>
    );
  }
}

export default OrgDetails;
