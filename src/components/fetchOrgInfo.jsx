import React from "react";
import {
  Row,
  Col,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Card,
  Carousel
} from "react-bootstrap";
import AutoSearch from "./autoSearch";

var globalAFile;
var globalGFile;

const IP = require("./ipconfig.js");

class FetchOrgInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      type: "",
      desc: "",
      images: [],
      coll: [],
      gfiles: [],
      loadComp: <AutoSearch />,
      selectedCollName: "",
      carousel: []
    };
  }

  loadComponent(value) {
    this.setState({
      loadComp: value
    });
  }

  async componentDidMount() {
    var orgName = this.props.orgname;

    const url =
      "http://" + IP + ":8000/api.singleOrganism.details?orgName=" + orgName;

    const respose = await fetch(url);
    const data = await respose.json();
    const results = data["results"][0];

    if (results === undefined) {
      window.location.href = "http://" + IP + ":3000/error";
    } else {
      globalAFile = results["coll"];
      globalGFile = results["genomefiles"];

      let temp = results["coll"];
      let realColl = [];

      temp.forEach(element => {
        realColl.push(element.split(":")[0]);
      });

      temp = results["genomefiles"];
      let realGFiles = [];
      temp.forEach(element => {
        realGFiles.push(element.split(":")[0]);
      });

      await this.setState({
        name: results["name"],
        type: results["type"],
        desc: results["desc"],
        images: results["images"],
        coll: realColl,
        gfile: realGFiles
      });
      this.loadImages();
    }
  }

  loadImages = () => {
    let comps = [];
    if (this.state.images.length === 0) {
      comps.push(
        <Carousel.Item>
          <img
            key="temp-image"
            className="d-block w-100 update-image-img"
            src="https://www.sciencenews.org/wp-content/uploads/2019/03/031219_TS_gene-editing_feat.jpg"
            alt="Temporary-Placeholder"
            height="400px"
          />
          <Carousel.Caption>
            <h3>This is a temporary image</h3>
            <p>
              Ref:
              https://www.sciencenews.org/wp-content/uploads/2019/03/031219_TS_gene-editing_feat.jpg
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      );
    } else {
      this.state.images.forEach(image => {
        let loc =
          "http://" +
          IP +
          ":8000/getImage?i=" +
          image +
          "&o=" +
          this.state.name;

        comps.push(
          <Carousel.Item>
            <div className="bg-image">
              <center>
                <img
                  key={image}
                  className="d-block carousel-image"
                  src={loc}
                  alt="First slide"
                  height="400px"
                />
              </center>
            </div>
          </Carousel.Item>
        );
      });
    }

    this.setState({
      carousel: comps
    });
  };

  async goToGraph(event) {
    var index = event.target.id;
    console.log(globalAFile[index]);
    const data = {
      file: globalAFile[index],
      gFile: globalGFile[index],
      orgName: this.state.name
    };
    localStorage.setItem("orgData", JSON.stringify(data));
    window.open("http://" + IP + ":3000/graph", "_blank");
  }

  render() {
    return (
      <Row>
        <Col>
          <div className="fetch-org-outer-div">
            <Card className="fetch-org-card">
              <Carousel>{this.state.carousel}</Carousel>

              <Row>
                <Col>
                  <div style={{ float: "right", margin: "1%" }}>
                    <DropdownButton
                      as={ButtonGroup}
                      title="Annotation Visualization"
                      id="bg-nested-dropdown"
                      variant="secondary"
                    >
                      {this.state.coll.map((item, index) => (
                        <Dropdown.Item
                          eventKey={index}
                          id={index}
                          onClick={this.goToGraph.bind(this)}
                        >
                          {item}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </div>
                </Col>
              </Row>

              <Card.Body>
                <Card.Title>{this.state.name}</Card.Title>

                <Card.Title className="org-type-fetch">
                  {this.state.type}
                </Card.Title>
                <br />
                <Card.Text>{this.state.desc}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    );
  }
}

export default FetchOrgInfo;
