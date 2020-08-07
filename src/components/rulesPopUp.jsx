import React, { Component } from "react";
import { Modal, Button, Image, Col, Row } from "react-bootstrap";

export class NBARules extends Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">NOTICE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={3}>
              &nbsp;{" "}
              <a
                href="http://nbaindia.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="http://nbaindia.org/images/logo.png" />
              </a>
            </Col>
            <Col sm={9} className="mt-3">
              <br />
              By entering this website you agree to abide by the rules of
              NATIONAL BIODIVERSITY AUTHORITY, India.
            </Col>
          </Row>
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="info"
            name="more"
            id="more"
            onClick={this.props.onHide}
            href="http://nbaindia.org/content/17/20/1/rules.html"
            target="_blank"
          >
            Learn More
          </Button>

          <Button
            variant="secondary"
            name="closeBtn"
            id="closeBtn"
            onClick={this.props.onHide}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
