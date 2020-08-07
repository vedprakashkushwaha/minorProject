import React, { Component } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";

export class Summary extends Component {
  componentDidMount() {}

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
            Summary of {this.props.orgname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Label>Total Number of Genes:</Form.Label>
              </Col>
              <Col>
                <Form.Label>{this.props.totalgenes}</Form.Label>
              </Col>
            </Row>
            <hr />

            <Row>
              <Col>
                <Form.Label>Total Number of Labelled Genes:</Form.Label>
              </Col>
              <Col>
                <Form.Label>{this.props.labelledgenes}</Form.Label>
              </Col>
            </Row>
            <hr />

            <Row>
              <Col>
                <Form.Label>Total Number of Unlabelled Genes:</Form.Label>
              </Col>
              <Col>
                <Form.Label>{this.props.unlabelledgenes}</Form.Label>
              </Col>
            </Row>
            <hr />

            <Row>
              <Col>
                <Form.Label>Total Number of Unique Genes:</Form.Label>
              </Col>
              <Col>
                <Form.Label>{this.props.uniquegenes}</Form.Label>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <Form.Label>Length of the Genome Sequence:</Form.Label>
              </Col>
              <Col>
                <Form.Label>{this.props.gLength}</Form.Label>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="info"
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
