import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./font-awesome/css/font-awesome.min.css";
import "./styles.css";

export class RepilconInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgName: ""
    };
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    let name = String(nextProps.orgname);
    name = name.split(":")[0];
    this.setState({
      orgName: name
    });
  }

  copy = id => {
    var copiedText = document.getElementById(id).value;
    var temp = document.createElement("input");
    document.body.appendChild(temp);
    temp.value = copiedText;
    temp.select();
    document.execCommand("copy", false);
    temp.remove();
  };

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
            Details of {this.props.GeneName} gene
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Gene Name</Form.Label>
              <Form.Control type="text" value={this.props.GeneName} />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Locus Tag</Form.Label>
              <Form.Control type="text" value={this.props.LocusTag} />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Start Position</Form.Label>
              <Form.Control type="text" value={this.props.start} />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>End Position</Form.Label>
              <Form.Control type="text" value={this.props.end} />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>
                Protein Sequence &nbsp;
                <abbr className="show-pointer" title="Click to copy">
                  <i
                    className="fa fa-copy"
                    onClick={() => this.copy("proSeq")}
                  ></i>
                </abbr>
              </Form.Label>
              <Form.Control
                id="proSeq"
                className="no-resize"
                as="textarea"
                rows="3"
                value={this.props.ProteinSequence}
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>
                NucSequence &nbsp;
                <abbr className="show-pointer" title="Click to copy">
                  <i
                    className="fa fa-copy"
                    onClick={() => this.copy("nucSeq")}
                  ></i>
                </abbr>
              </Form.Label>

              <Form.Control
                id="nucSeq"
                className="no-resize"
                as="textarea"
                rows="3"
                value={this.props.NucSequence}
              />
            </Form.Group>
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
