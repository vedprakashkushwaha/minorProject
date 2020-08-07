import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export class GeneSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
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

  componentWillReceiveProps(nextProps) {
    let data = nextProps.genedata;
    let length = data.length;
    let comp = [];

    for (let i = 0; i < length; i++) {
      comp.push(
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Gene Name</Form.Label>
            <Form.Control type="text" value={data[i]["GeneName"]} />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label>Locus Tag</Form.Label>
            <Form.Control type="text" value={data[i]["LocusTag"]} />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput3">
            <Form.Label>Start Position</Form.Label>
            <Form.Control type="text" value={data[i]["StartPosition"]} />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput4">
            <Form.Label>End Position</Form.Label>
            <Form.Control type="text" value={data[i]["EndPosition"]} />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlTextarea5">
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
              value={data[i]["ProteinSequence"]}
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
              value={data[i]["NucSequence"]}
            />
          </Form.Group>
          <hr />
        </Form>
      );
    }
    this.setState({
      results: comp
    });
  }

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
            Search Result(s)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.results}</Modal.Body>
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
