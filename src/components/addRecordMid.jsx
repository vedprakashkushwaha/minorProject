import React from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./styles.css";

const IP = require("./ipconfig.js");

class NewRecordInfo extends React.Component {
  componentDidMount() {
    document.getElementById("uploadBtn").disabled = true;
    this.getCount();
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: [],
      fileNames: [],
      genomeFiles: [],
      component: [],
      count: 1,
      uploadState: "Upload"
    };
  }

  onChangeHandler = event => {
    this.setState({
      uploadState: "Upload"
    });
    let fileNames = this.state.selectedFile;
    if (event.target.files[0]) {
      fileNames[event.target.name] = event.target.files[0]["name"];
      this.setState({
        selectedFile: fileNames
      });
    }
    this.allOK();
  };

  onClickHandler = async file => {
    const data = new FormData();
    data.append("file", file);

    var dirPath = this.props.name + "/";

    await axios
      .post("http://" + IP + ":8000/upload", data, {
        headers: { path: dirPath }
      })
      .then(res => {
        console.log(res.statusText);
      });
  };

  parseFile = async (fName, collName, genomeFile) => {
    const data = new URLSearchParams();

    data.append("fName", fName);
    data.append("collName", collName);
    data.append("genomeFile", genomeFile);
    data.append("parentName", this.props.name);

    await axios.post("http://" + IP + ":8000/parseFile", data).then(res => {
      console.log(res.statusText);

      let result = res.data["results"];
      if (result !== "OK") {
        let msg =
          fName +
          " file was not uploaded since it does not have following fields: " +
          result;
        window.open("http://" + IP + ":8000/helpFile", "_blank");
        alert(msg);
      }
    });
  };

  async onUploadClick() {
    this.disableAll();

    this.setState({
      uploadState: "Uploading"
    });

    document.getElementById("uploadBtn").disabled = true;

    let count = this.state.count;
    let names = [];
    let genomeFiles = [];

    for (let i = 0; i < count; i++) {
      let textID = "name" + i;
      let fileID = "file" + i;
      let genomeFileID = "genomeFile" + i;

      let tempGName =
        document.getElementById(textID).value +
        ":" +
        document.getElementById(genomeFileID).files[0]["name"];

      let tempFName =
        document.getElementById(textID).value +
        ":" +
        document.getElementById(fileID).files[0]["name"];

      names.push(tempFName);
      genomeFiles.push(tempGName);

      await this.onClickHandler(document.getElementById(fileID).files[0]);
      await this.onClickHandler(document.getElementById(genomeFileID).files[0]);

      await this.parseFile(
        document.getElementById(fileID).files[0]["name"],
        tempFName,
        tempGName
      );
    }

    await this.setState({
      uploadState: "Uploaded!",
      fileNames: names,
      genomeFiles: genomeFiles
    });

    window.location.href = "http://" + IP + ":3000/godMode";
  }

  disableAll() {
    let N = this.state.count;
    for (let i = 0; i < N; i++) {
      let fileID = "file" + i;
      let textID = "name" + i;
      let genomeID = "genomeFile" + i;
      document.getElementById(fileID).disabled = true;
      document.getElementById(textID).disabled = true;
      document.getElementById(genomeID).disabled = true;
    }

    document.getElementById("uploadBtn").disabled = false;
    document.getElementById("cancelBtn").disabled = true;
    document.getElementById("remove").disabled = true;
    document.getElementById("addMore").disabled = true;
  }

  checkName = event => {
    let text = event.target.value;
    if (text.indexOf(",") > -1) {
      event.target.value = text.slice(0, text.indexOf(","));
    }
    this.allOK();
  };

  allOK = () => {
    let count = this.state.count;
    let flag = 0;
    for (let i = 0; i < count; i++) {
      let fileID = "file" + i;
      let textID = "name" + i;
      let genomeID = "genomeFile" + i;
      if (
        document.getElementById(fileID).files[0] === undefined ||
        document.getElementById(genomeID).files[0] === undefined ||
        document.getElementById(textID).value === ""
      ) {
        flag = 0;
        break;
      } else {
        flag = 1;
      }
    }
    if (flag) {
      document.getElementById("uploadBtn").disabled = false;
    } else {
      document.getElementById("uploadBtn").disabled = true;
    }
  };

  async getCount(event) {
    var N = this.state.count;
    var comps = [];
    var junkValue = [];

    document.getElementById("uploadBtn").hidden = false;

    for (let i = 0; i < N; i++) {
      let fileID = String("file" + i);
      let textID = String("name" + i);
      let genomeID = String("genomeFile" + i);

      junkValue.push(i);

      comps.push(
        <div key={"div" + i} id="uploadSeqForm">
          <Row>
            <Col>
              <input
                type="text"
                id={textID}
                key={textID}
                onChange={this.checkName}
                placeholder="Enter Replicon Name"
              ></input>
            </Col>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Col>
              <input
                name={i}
                type="file"
                className="selectFile"
                id={fileID}
                key={fileID}
                accept=".txt, .fasta"
                onChange={this.onChangeHandler}
                style={{ width: "70%" }}
              ></input>
            </Col>
            <Col>
              <input
                name="genomeFile"
                type="file"
                className="selectGenomeFile"
                id={genomeID}
                key={genomeID}
                accept=".txt, .fasta"
                style={{ width: "70%" }}
                onChange={this.allOK}
              ></input>
            </Col>
          </Row>
        </div>
      );
    }
    await this.setState({
      component: comps,
      selectedFile: junkValue
    });
  }

  async incrementCount() {
    await this.setState({
      count: this.state.count + 1
    });
    this.getCount();
    this.allOK();
  }

  async decrementCount() {
    if (this.state.count > 1) {
      await this.setState({
        count: this.state.count - 1
      });
      this.getCount();
    }
    this.allOK();
  }

  rollBack = async () => {
    const data = new URLSearchParams();

    data.append("oName", this.props.name);

    await axios
      .post("http://" + IP + ":8000/deleteOrganism", data)
      .then(res => {
        console.log(res.statusText);
        window.location.href = "http://" + IP + ":3000/godMode";
      });
  };

  render() {
    let help = "http://" + IP + ":8000/helpFile";
    return (
      <Card className="add-new add-new-rec">
        <Card.Header className="overview-header">
          <center>Add New Replicon(s) to {this.props.name}</center>
        </Card.Header>
        <Card.Body>
          <Form method="post" name="uploadMergedFile" id="uploadMergedFile">
            <Form.Row>
              <Button
                id="addMore"
                name="addMore"
                variant="outline-dark"
                style={{
                  borderColor: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.1)"
                }}
                onClick={this.incrementCount.bind(this)}
              >
                + Add More
              </Button>
              &nbsp;
              <Button
                id="remove"
                name="remove"
                variant="outline-dark"
                style={{
                  borderColor: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.1)"
                }}
                onClick={this.decrementCount.bind(this)}
              >
                - Remove One
              </Button>
              <a href={help} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="light"
                  className="help-btn"
                  style={{ borderRadius: "50%" }}
                >
                  <FontAwesomeIcon icon={faInfo} size="lg" />
                </Button>
              </a>
            </Form.Row>

            <br />

            <div className="add-rec-mid">
              <Container>
                <Row>
                  <Col>Replicon Name</Col>
                  <Col></Col>
                  <Col>Annotation File</Col>
                  <Col>Genome Sequence File</Col>
                </Row>
                <Row>{this.state.component}</Row>
              </Container>
            </div>
            <input
              type="hidden"
              name="parentName"
              id="parentName"
              value={this.props.name}
              required
            ></input>
            <input
              type="hidden"
              name="allFiles"
              id="allFiles"
              value={this.state.selectedFile}
            ></input>
            <input
              type="hidden"
              name="fileNames"
              id="fileNames"
              value={this.state.fileNames}
              required
            ></input>
            <input
              type="hidden"
              name="genomeFileNames"
              id="genomeFileNames"
              value={this.state.genomeFiles}
              required
            ></input>
            <Button
              id="uploadBtn"
              className="pro-can-btn upload-btn"
              onClick={this.onUploadClick.bind(this)}
            >
              {this.state.uploadState}
            </Button>
            <Button
              id="cancelBtn"
              variant="danger"
              type="reset"
              className="pro-can-btn"
              onClick={this.rollBack}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default NewRecordInfo;
