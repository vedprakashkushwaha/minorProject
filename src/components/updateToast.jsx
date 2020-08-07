import { Toast, Row, Col } from "react-bootstrap";
import React, { Component } from "react";

export default class UpdateToast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curr: ""
    };
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    let date = new Date();

    let time = "Today, " + date.getHours() + ":" + date.getMinutes();

    this.setState({
      curr: time
    });
  }
  render() {
    return (
      <Row>
        <Col xs={6}>
          <Toast
            {...this.props}
            onClose={this.props.onHide}
            show={this.props.show}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded mr-2"
                alt=""
              />
              <strong className="mr-auto">Message</strong>
              <small>{this.state.curr}</small>
            </Toast.Header>
            <Toast.Body>
              Organism details have been updated successfully. Please refresh if
              changes are not reflected.
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
    );
  }
}
