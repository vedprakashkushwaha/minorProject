import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import "./styles.css";

const IP = require("./ipconfig.js");

class Footer extends Component {
  render() {
    let home = "http://" + IP + ":3000/?home";
    let aboutUs = "http://" + IP + ":3000/?aboutUs";
    let contactUs = "http://" + IP + ":3000/?contactUs";
    let admin = "http://" + IP + ":3000/?login";

    return (
      <Navbar className="footer" fluid>
        <Navbar.Brand className="footer-brand" align="center">
          <center>
            <p className="footer-text">
              <span className="hide">
                {" "}
                By using this site, you agree to the Terms of Use and Privacy
                Policy of NATIONAL BIODIVERSITY AUTHORITY, India. &copy; 2019
                All Right Reserved
              </span>
              <br />
              <p className="footer-links">
                <span
                  onClick={() => {
                    window.location.href = home;
                  }}
                >
                  {" "}
                  Home
                </span>{" "}
                |<span href="http://www.tezu.ernet.in"> TU Home</span> |
                <span href="http://agnigarh.tezu.ernet.in/~ssankar/index.html">
                  {" "}
                  Guide{" "}
                </span>
                |
                <span
                  onClick={() => {
                    window.location.href = aboutUs;
                  }}
                >
                  {" "}
                  About Us
                </span>{" "}
                |
                <span
                  onClick={() => {
                    window.location.href = contactUs;
                  }}
                >
                  {" "}
                  Contact Us
                </span>{" "}
                |
                <span
                  onClick={() => {
                    window.location.href = admin;
                  }}
                >
                  {" "}
                  Admin
                </span>
              </p>
            </p>
          </center>
        </Navbar.Brand>
      </Navbar>
    );
  }
}

export default Footer;
