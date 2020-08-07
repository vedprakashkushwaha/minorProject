import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NewRecordInfo from "../addRecordMid";
import Logo from "../logo";
import HeaderMenuButtons from "../headerMenuButtons";

class AddRecord extends Component {
  render() {
    return (
      <Container fluid={true}>
        {/* header */}
        <Row>
          <Col>
            <Logo />
          </Col>

          <Col className="d-flex flex-column">
            <HeaderMenuButtons />
          </Col>
        </Row>

        {/* mid body */}
        <Row>
          <Col
            style={{
              height: 700
            }}
          >
            <NewRecordInfo />
          </Col>
        </Row>

        {/* footer */}
        <Row>
          <Col style={{ height: 100 }}></Col>
        </Row>
      </Container>
    );
  }
}

export default AddRecord;
