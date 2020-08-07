import React, { Component } from "react";
import { Nav, Navbar, Row, Col, Container, Dropdown } from "react-bootstrap";
import AddDescriptionMid from "./addDescription";
import DataOverview from "./dataOverview";
import NewRecordInfo from "./addRecordMid";
import "./styles.css";
import Cookies from "universal-cookie";
import axios from "axios";
import { ChangeAdminPass } from "./changePassPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Log } from "./logs";

const IP = require("./ipconfig.js");

var url1 = require("url");
// const adminHomePage = <DataOverview />;
var addNewPage = <AddDescriptionMid />;

class AdminHome extends Component {
  constructor() {
    super();
    this.state = {
      loadComp: <DataOverview />,
      organismName: [],
      changePassShow: false,
      logShow: false
    };
  }

  loadChangePass() {
    this.setState({ changePassShow: true });
  }

  loadLog() {
    this.setState({ logShow: true });
  }

  loadComponent(value) {
    this.setState({
      loadComp: value
    });
  }

  setOrgName(val) {
    this.loadComponent(<NewRecordInfo name={val} />);
  }

  checkLogin = async () => {
    const cookies = new Cookies();
    const data = new URLSearchParams();

    let uName = cookies.get("uName");
    let uPass = cookies.get("uPass");

    let result = "NO";

    data.append("uName", uName);
    data.append("uPass", uPass);

    await axios.post("http://" + IP + ":8000/checkLogin", data).then(res => {
      console.log(res.statusText);
      if (res.data["results"] === "OK") {
        result = "OK";
      }
    });
    return result;
  };

  async componentWillMount() {
    let retVal = await this.checkLogin();
    if (retVal === "NO") {
      window.location.href = "http://" + IP + ":3000/?login";
    }
  }

  async componentDidMount() {
    var q = url1.parse(document.URL, true);
    var qData = q.query;

    var orgName = qData.orgName;
    var cmd = qData.cmd;

    if (orgName) {
      this.setOrgName(orgName);
    } else if (cmd === "addneworg") {
      this.loadComponent(addNewPage);
    } else {
      const url = "http://" + IP + ":8000/api.organism.name";
      const respose = await fetch(url);
      const data = await respose.json();
      this.setState({
        organismName: data["results"],
        loading: true
      });
    }
  }

  logMeOut = async () => {
    const cookies = new Cookies();
    cookies.remove("uName");
    cookies.remove("uPass");

    window.location.href = "http://" + IP + ":3000/?login";
  };

  render() {
    let changePassClose = () => this.setState({ changePassShow: false });
    let logClose = () => this.setState({ logShow: false });

    let admin = "http://" + IP + ":3000/godMode";

    return (
      <Container fluid={true} className="admin-home-container">
        <Row>
          {/* <AdminHeader /> */}
          <Navbar bg="dark" variant="dark" className="admin-home-navbar">
            <Navbar.Brand href={admin} className="show-pointer">
              ADMIN PANEL
            </Navbar.Brand>
            &nbsp;&nbsp;&nbsp;
            <Nav className="mr-auto"></Nav>
            <Dropdown className="admin-setting">
              <Dropdown.Toggle
                id="adminDD"
                className="admin-setting"
                variant="outline-secondary"
              >
                <FontAwesomeIcon icon={faBars} size="sm" /> Settings
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    window.location.href = "http://" + IP + ":3000/home";
                  }}
                >
                  Home Page
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.loadLog()}>
                  Check Logs
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.loadChangePass()}>
                  Reset Pass
                </Dropdown.Item>
                <Dropdown.Item onClick={this.logMeOut}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <ChangeAdminPass
              show={this.state.changePassShow}
              onHide={changePassClose}
            />
            <Log show={this.state.logShow} onHide={logClose} />
          </Navbar>
        </Row>

        {/* mid body */}
        <Row>
          <Col className="admin-home-midbody">{this.state.loadComp}</Col>
        </Row>
      </Container>
    );
  }
}

export default AdminHome;
