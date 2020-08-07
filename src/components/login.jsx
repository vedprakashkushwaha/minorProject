import React, { Component } from "react";
import { Button, Row, Col, Card, Form, Alert } from "react-bootstrap";
import "./styles.css";
import "bootstrap";
import Cookies from "universal-cookie";
import axios from "axios";

const IP = require("./ipconfig.js");

// eslint-disable-next-line no-extend-native
String.prototype.hashCode = function() {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

class Login extends Component {
  async componentDidMount() {
    const cookies = new Cookies();
    let uName = cookies.get("uName");
    let uPass = cookies.get("uPass");
    const data = new URLSearchParams();

    data.append("uName", uName);
    data.append("uPass", uPass);
    // data.append("encode", "NO");

    await axios.post("http://" + IP + ":8000/checkLogin", data).then(res => {
      console.log(res.statusText);
      if (res.data["results"] === "OK") {
        window.location.href = "http://" + IP + ":3000/godMode";
      }
    });
  }

  logMeIn = async () => {
    const cookies = new Cookies();

    let uName = document.getElementById("uname").value;
    let uPass = document.getElementById("upass").value;

    const data = new URLSearchParams();

    data.append("uName", uName);
    data.append("uPass", uPass.hashCode());

    await axios.post("http://" + IP + ":8000/checkLogin", data).then(res => {
      console.log(res.statusText);
      console.log(res.data["results"]);
      if (res.data["results"] === "OK") {
        cookies.set("uName", uName, { path: "/" });
        cookies.set("uPass", res.data["hash"]);
        window.location.href = "http://" + IP + ":3000/godMode";
      } else {
        document.getElementById("errAlert").hidden = false;
      }
    });
  };

  render() {
    return (
      <Row className="admin-row">
        <Col>
          <center>
            <Card className="admin-login">
              <Card.Header as="h5">Admin Login Panel</Card.Header>
              <Card.Body>
                <Alert variant="danger" id="errAlert" hidden>
                  Either username or password is wrong
                </Alert>
                <Row>
                  <Col sm="4">
                    <Card.Title>Username</Card.Title>
                  </Col>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      id="uname"
                      placeholder="Enter username"
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm="4">
                    <Card.Title>Password</Card.Title>
                  </Col>
                  <Col sm="8">
                    <Form.Control
                      type="password"
                      className="umm"
                      id="upass"
                      placeholder="**********"
                    />
                  </Col>
                </Row>
                <br />
                <Button
                  variant="success"
                  className="login-cancel-btn"
                  onClick={this.logMeIn}
                >
                  Sign in
                </Button>
                <Button
                  variant="secondary"
                  className="login-cancel-btn"
                  onClick={() => {
                    window.location.href = "http://" + IP + ":3000/?home";
                  }}
                >
                  Back
                </Button>
                &nbsp;&nbsp;&nbsp;
              </Card.Body>
            </Card>
          </center>
        </Col>
      </Row>
    );
  }
}

export default Login;
