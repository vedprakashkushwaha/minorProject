import React, { Component } from "react";
import AutoSearch from "./autoSearch";
import Logo from "./logo";
import {
  Button,
  Row,
  Col,
  Container,
  Navbar,
  Nav,
  Image
} from "react-bootstrap";
import FetchOrgInfo from "./fetchOrgInfo";
import "./styles.css";
import ShowAll from "./showAll";
import { NBARules } from "./rulesPopUp";
import Footer from "./footer";
import AboutUs from "./aboutUs";
import Login from "./login";
import ContactUs from "./contactUs";

var url1 = require("url");

const homePage = <AutoSearch />;
const showAllPage = <ShowAll />;
const aboutUs = <AboutUs />;
const login = <Login />;
const contactUs = <ContactUs />;

const IP = require("./ipconfig.js");

class LayoutFile extends Component {
  constructor() {
    super();
    this.state = {
      loadComp: <AutoSearch />,
      NBAShow: false
    };
  }

  componentDidMount() {
    if (document.URL.length > 32) {
      var q = url1.parse(document.URL, true);
      var qData = q.query;
      var orgName = qData.orgName;
      this.loadComponent(<FetchOrgInfo orgname={orgName} />);
    } else if (document.URL === "http://" + IP + ":3000/?showAll") {
      this.loadComponent(showAllPage);
    } else if (document.URL === "http://" + IP + ":3000/?login") {
      this.loadComponent(login);
    } else if (document.URL === "http://" + IP + ":3000/?contactUs") {
      this.loadComponent(contactUs);
    } else if (document.URL === "http://" + IP + ":3000/?aboutUs") {
      this.loadComponent(aboutUs);
    } else if (document.URL === "http://" + IP + ":3000/?home") {
      this.loadComponent(homePage);
    } else {
      this.loadNBA();
    }
  }

  loadComponent(value) {
    this.setState({
      loadComp: value
    });
  }

  // show rules pop-up
  loadNBA() {
    this.setState({ NBAShow: true });
  }

  render() {
    let NBAClose = () => this.setState({ NBAShow: false });
    return (
      <Container fluid={true}>
        {/* header */}
        <Row className="header">
          <Col className="header">
            <Navbar expand="lg">
              <Navbar.Brand href="/">
                <Logo />
              </Navbar.Brand>
              <Image
                src="banner-alt.png"
                className="banner"
                id="banner"
                alt="banner"
              />

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto"> </Nav>
                <Button variant="link" className="square-corner headerButton">
                  <Nav.Link
                    className="header-btn"
                    style={{ color: "white" }}
                    onClick={() => this.loadComponent(homePage)}
                  >
                    HOME
                  </Nav.Link>
                </Button>
                <Button variant="link" className="square-corner headerButton">
                  <Nav.Link
                    className="header-btn"
                    style={{ color: "white" }}
                    onClick={() => this.loadComponent(showAllPage)}
                  >
                    OVERVIEW
                  </Nav.Link>
                </Button>
                <Button variant="link" className="square-corner headerButton">
                  <Nav.Link
                    className="header-btn"
                    style={{ color: "white" }}
                    onClick={() => this.loadComponent(aboutUs)}
                  >
                    ABOUT US
                  </Nav.Link>
                </Button>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>

        {/* mid body */}
        <Row>
          <Col className="layout-file-midbody">{this.state.loadComp}</Col>
        </Row>

        {/* footer */}
        <Row>
          {/* <Col> */}
          <Footer />
          {/* </Col> */}
          <NBARules show={this.state.NBAShow} onHide={NBAClose} />
        </Row>
      </Container>
    );
  }
}

export default LayoutFile;
