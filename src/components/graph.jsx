import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  Dropdown,
  Navbar,
  Nav,
  Image
} from "react-bootstrap";
import "./styles.css";
import "./font-awesome/css/font-awesome.min.css";
import "bootstrap";
import Logo from "./logo";

import { GInfo } from "./genomeInfoPopUp";
import { RepilconInfo } from "./repliconDetailPopUp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { GeneSearchResult } from "./geneSearchResult";
import { DownloadByLoc } from "./downloadByLoc";
import Loading from "./loading";
import Footer from "./footer";
import { Summary } from "./summary";

const IP = require("./ipconfig.js");

var data = "";
var prevDiv = "";
class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: "",
      gFile: "",
      orgName: "",
      cleanOrg: "",
      page: [],
      data: null,
      loading: 1,
      geneResult: [],
      infoPopUpShow: false,
      geneResultShow: false,
      downloadShow: false,
      summaryShow: false,
      totalGenes: 0,
      labelledGenes: 0,
      unlabelledGene: 0,
      uniqueGenes: 0,
      genomeLength: 0,
      ddList: [],
      allGenes: [],
      dd: (
        <span>
          Download <FontAwesomeIcon icon={faDownload} size="sm" />
        </span>
      )
    };
  }

  async loadData(s, e, name) {
    //var collectionName = "prokka";
    const url =
      "http://" +
      IP +
      ":8000/api.singleCell.details?name=" +
      name +
      "&start=" +
      s +
      "&end=" +
      e;
    // alert(url);
    const response = await fetch(url);
    const data1 = await response.json();
    var data = data1["results"];
    console.log(data);

    await this.setState({
      GeneName: data[0]["GeneName"],
      LocusTag: data[0]["LocusTag"],
      ProteinSequence: data[0]["ProteinSequence"],
      NucSequence: data[0]["NucSequence"]
    });
  }

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async componentWillMount() {
    data = localStorage.getItem("orgData");
    data = JSON.parse(data);
    let temp = data["file"].split(":")[0];
    await this.setState({
      fileName: data["file"],
      orgName: data["orgName"],
      gFile: data["gFile"],
      cleanOrg: temp
    });
  }

  async componentDidMount() {
    var graphText = [];

    var collectionName = this.state.fileName;
    // alert(collectionName);
    //var collectionName = "prokka";
    const url =
      "http://" +
      IP +
      ":8000/api.gene.location?collectionName=" +
      collectionName;
    const response = await fetch(url);
    const data1 = await response.json();
    var data = data1["results"];
    this.setState({
      totalGenesCount: data.length
    });

    //Object { serial: 13608, StartPosition: "3636047", EndPosition: "3636907", width: 860, Strand: "-", GeneName: "" }
    var barTop = 40;
    var k = 0;
    var scaleCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (k === Math.floor(data[i].StartPosition / 10000)) {
        var scaleStyle = {
          position: "absolute",
          left: "0px",
          top: barTop - 40 + "px"
        };

        var hrLStyle = {
          position: "absolute",
          left: "0px",
          top: barTop + "px"
        };

        if (scaleCount === 0) {
          graphText.push(
            <div className="scale" style={scaleStyle}>
              {" "}
              <p className="scaleDigit" id="1">
                <i className="fa fa-arrow-down" aria-hidden="true"></i> 00000
              </p>
            </div>
          );
        } else {
          graphText.push(
            <div className="scale" style={scaleStyle}>
              <p className="scaleDigit" id={String(scaleCount * 10000 + 1)}>
                <i className="fa fa-arrow-down" aria-hidden="true"></i>
                {scaleCount * 10000 + 1}
              </p>
            </div>
          );
        }

        graphText.push(
          <div className="hrL" style={hrLStyle}>
            {" "}
          </div>
        );
        k++;
        barTop = barTop + 62;
        scaleCount++;
      }
    }

    for (let i = 1; i < 10; i++) {
      var separatorStyle = {
        position: "absolute",
        left: i * 100 + "px",
        top: "0px",
        height: barTop + "px"
      };
      graphText.push(
        <div className="separator" style={separatorStyle}>
          {i * 1000}{" "}
        </div>
      );
    }

    var rowCount = 1;
    var top = 20;

    for (let i = 0; i < data.length; i++) {
      var color = this.getRandomColor();

      if (
        rowCount === Math.floor(data[i].StartPosition / 10000) ||
        rowCount === Math.floor(data[i].EndPosition / 10000)
      ) {
        if (
          Math.floor(data[i].StartPosition / 10000) ===
          Math.floor(data[i].EndPosition / 10000)
        ) {
          rowCount = rowCount + 1;
          top = top + 62;

          if (data[i].Strand === "+") {
            var colsStyle = {
              width: data[i].width / 10 + "px",
              backgroundColor: color,
              position: "absolute",
              top: top + "px",
              left: (data[i].StartPosition - (rowCount - 1) * 10000) / 10 + "px"
            };

            graphText.push(
              <div
                onClick={() =>
                  this.loadInfoPopUp(
                    data[i].StartPosition,
                    data[i].EndPosition,
                    this.state.fileName
                  )
                }
              >
                <div className="cols" id={data[i].GeneName} style={colsStyle}>
                  {data[i].GeneName}{" "}
                </div>
              </div>
            );
          } else {
            colsStyle = {
              width: data[i].width / 10 + "px",
              backgroundColor: color,
              position: "absolute",
              top: top + 22 + "px",
              left: (data[i].StartPosition - (rowCount - 1) * 10000) / 10 + "px"
            };
            graphText.push(
              <div
                onClick={() =>
                  this.loadInfoPopUp(
                    data[i].StartPosition,
                    data[i].EndPosition,
                    this.state.fileName
                  )
                }
              >
                <div className="cols" id={data[i].GeneName} style={colsStyle}>
                  {data[i].GeneName}{" "}
                </div>
              </div>
            );
          }
        } else {
          var w = (10000 * rowCount - data[i].StartPosition) / 10;

          if (data[i].Strand === "+") {
            colsStyle = {
              width: w + "px",
              backgroundColor: color,
              position: "absolute",
              top: top + "px",
              left: (data[i].StartPosition - (rowCount - 1) * 10000) / 10 + "px"
            };
            graphText.push(
              <div
                onClick={() =>
                  this.loadInfoPopUp(
                    data[i].StartPosition,
                    data[i].EndPosition,
                    this.state.fileName
                  )
                }
              >
                <div className="cols" id={data[i].GeneName} style={colsStyle}>
                  {data[i].GeneName}{" "}
                </div>
              </div>
            );
          } else {
            colsStyle = {
              width: w + "px",
              backgroundColor: color,
              position: "absolute",
              top: top + 22 + "px",
              left: (data[i].StartPosition - (rowCount - 1) * 10000) / 10 + "px"
            };
            graphText.push(
              <div
                onClick={() =>
                  this.loadInfoPopUp(
                    data[i].StartPosition,
                    data[i].EndPosition,
                    this.state.fileName
                  )
                }
              >
                <div className="cols" id={data[i].GeneName} style={colsStyle}>
                  {data[i].GeneName}{" "}
                </div>
              </div>
            );
          }

          w = (data[i].EndPosition - 10000 * rowCount) / 10;

          rowCount = rowCount + 1;

          top = top + 62;

          if (data[i].Strand === "+") {
            colsStyle = {
              width: w + "px",
              backgroundColor: color,
              position: "absolute",
              top: top + "px",
              left: 0 + "px"
            };
            graphText.push(
              <div
                onClick={() =>
                  this.loadInfoPopUp(
                    data[i].StartPosition,
                    data[i].EndPosition,
                    this.state.fileName
                  )
                }
              >
                <div className="cols" id={data[i].GeneName} style={colsStyle}>
                  {data[i].GeneName}{" "}
                </div>
              </div>
            );
          } else {
            colsStyle = {
              width: w + "px",
              backgroundColor: color,
              position: "absolute",
              top: top + 22 + "px",
              left: 0 + "px"
            };
            graphText.push(
              <div
                onClick={() =>
                  this.loadInfoPopUp(
                    data[i].StartPosition,
                    data[i].EndPosition,
                    this.state.fileName
                  )
                }
              >
                <div className="cols" id={data[i].GeneName} style={colsStyle}>
                  {data[i].GeneName}{" "}
                </div>
              </div>
            );
          }
        }
      } else {
        if (data[i].Strand === "+") {
          colsStyle = {
            width: data[i].width / 10 + "px",
            backgroundColor: color,
            position: "absolute",
            top: top + "px",
            left: (data[i].StartPosition - (rowCount - 1) * 10000) / 10 + "px"
          };
          graphText.push(
            <div
              onClick={() =>
                this.loadInfoPopUp(
                  data[i].StartPosition,
                  data[i].EndPosition,
                  this.state.fileName
                )
              }
            >
              <div className="cols" id={data[i].GeneName} style={colsStyle}>
                {data[i].GeneName}{" "}
              </div>
            </div>
          );
        } else {
          colsStyle = {
            width: data[i].width / 10 + "px",
            backgroundColor: color,
            position: "absolute",
            top: top + 22 + "px",
            left: (data[i].StartPosition - (rowCount - 1) * 10000) / 10 + "px"
          };
          graphText.push(
            <div
              onClick={() =>
                this.loadInfoPopUp(
                  data[i].StartPosition,
                  data[i].EndPosition,
                  this.state.fileName
                )
              }
            >
              <div className="cols" id={data[i].GeneName} style={colsStyle}>
                {data[i].GeneName}{" "}
              </div>
            </div>
          );
        }
      }
    }

    this.setState({
      totalGenes: data.length
    });

    this.setState({
      page: graphText,
      loading: 0
    });

    this.getGenes();
    this.getAFileSize();
  }

  componentWillUpdate() {
    document.getElementById("locationTxt").focus();
  }

  find = async () => {
    let location = document.getElementById("locationTxt").value;

    if (location > 999) {
      location = Math.round(location / 10000) * 10000 + 1;
      window.location = "/graph#" + location;
    }
  };

  gotoGene = event => {
    let location = event.target.id;
    location = Math.floor(location / 10000) * 10000 + 1;
    document.getElementById("locationTxt").value = location;
    window.location.href = "http://" + IP + ":3000/graph#" + location;

    let geneName = event.target.name;

    if (prevDiv !== "") {
      document.getElementById(prevDiv).className = "cols";
    }

    document.getElementById(geneName).className = "cols-new";

    prevDiv = geneName;
  };

  getAFileSize = () => {
    const URLdata = new URLSearchParams();
    let cleanName = this.state.gFile.split(":")[1];

    URLdata.append("filename", cleanName);
    URLdata.append("orgname", this.state.orgName);

    axios.post("http://" + IP + ":8000/getAFileSize", URLdata).then(res => {
      this.setState({
        genomeLength: res.data["results"]
      });
    });
  };

  getGenes = async () => {
    const URLdata = new URLSearchParams();
    URLdata.append("collName", this.state.fileName);

    await axios.post("http://" + IP + ":8000/geneNames", URLdata).then(res => {
      this.setState({
        allGenes: res.data["results"]
      });
    });

    //console.log(this.state.allGenes);

    var namedGene = [];
    for (let i1 = 0; i1 < this.state.allGenes.length; i1++) {
      if (this.state.allGenes[i1]["GeneName"] !== "") {
        namedGene.push(this.state.allGenes[i1]["GeneName"]);
      }
    }
    var s = new Set(namedGene);
    // alert("named genes: " + namedGene.length); //named Gene
    // alert("unique genes: " + s.size); // unique named genes
    //this.state.totalGenesCount  --> total numbers of genes

    this.setState({
      labelledGenes: namedGene.length,
      unlabelledGene: this.state.totalGenesCount - namedGene.length,
      uniqueGenes: s.size
    });

    namedGene = null;
    s = null;

    // if (this.state.allGenes.slice(-1)[0]["EndPosition"] === null) {
    //   var temp = this.state.allGenes.slice(-2)[0]["EndPosition"];
    //   var totalLen = this.state.allGenes.slice(-2)[0]["Serial"];
    // } else {
    //   temp = this.state.allGenes.slice(-1)[0]["EndPosition"];
    //   totalLen = this.state.allGenes.slice(-1)[0]["Serial"];
    // }

    // this.setState({
    //   labelledGenes: temp,
    //   unlabelledGene: this.state.totalGenes[0]["serial"] - totalLen,
    //   uniqueGenes: s.size
    // });

    let dList = [];
    let i = 0;

    this.state.allGenes.forEach(element => {
      if (element["GeneName"] !== "" && element["GeneName"] !== null) {
        dList.push(
          <Dropdown.Item
            name={element["GeneName"]}
            id={element["StartPosition"]}
            eventKey={i}
            onClick={this.gotoGene}
          >
            {element["GeneName"]}
          </Dropdown.Item>
        );
        i = i + 1;
      }
    });

    this.setState({
      ddList: dList
    });
  };

  downloadFile = async event => {
    let fName = event.target.id;
    fName = fName.split(":")[1];

    let path = this.state.orgName + "/" + fName;

    window.location = "http://" + IP + ":8000/download/?path=" + path;
  };

  // open pop-up for info
  async loadInfoPopUp(s, e, name) {
    if (prevDiv !== "") {
      document.getElementById(prevDiv).className = "cols";
    }
    await this.loadData(s, e, name);
    this.setState({ infoPopUpShow: true, start: s, end: e, name: name });
  }

  // open pop-up for info
  async loadGeneResult(geneData) {
    this.setState({
      geneResult: geneData,
      geneResultShow: true
    });
    let location = this.state.geneResult[0]["StartPosition"];

    location = Math.round(location / 10000) * 10000 + 1;

    window.location.href = "http://" + IP + ":3000/graph#" + location;
  }

  // open pop-up for download
  loadDownloadPopUp = async () => {
    this.setState({ downloadShow: true });
  };

  // open pop-up for summary
  loadSummaryPopUp = async () => {
    this.setState({ summaryShow: true });
  };

  render() {
    let infoPopUpClose = () => this.setState({ infoPopUpShow: false });
    let geneResultClose = () => this.setState({ geneResultShow: false });
    let downloadClose = () => this.setState({ downloadShow: false });
    let summaryClose = () => this.setState({ summaryShow: false });

    if (this.state.loading === 1) {
      return (
        <Container fluid={true}>
          <Row className="header">
            <Col className="header">
              <Navbar expand="lg">
                <Navbar.Brand href="/">
                  <Logo />
                </Navbar.Brand>
                <Image
                  src="banner-alt.png"
                  className="banner"
                  id="banner"
                  alt="banner"
                />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto"></Nav>
                  <Button variant="link" className="square-corner headerButton">
                    <Nav.Link
                      className="header-btn"
                      style={{ color: "white" }}
                      href="/"
                      // onClick={() => this.loadComponent(homePage)}
                    >
                      HOME
                    </Nav.Link>
                  </Button>
                  <Button variant="link" className="square-corner headerButton">
                    <Nav.Link
                      className="header-btn"
                      style={{ color: "white" }}
                      onClick={() =>
                        (window.location.href =
                          "http://" + IP + ":3000/?showAll")
                      }
                    >
                      OVERVIEW
                    </Nav.Link>
                  </Button>
                  <Button variant="link" className="square-corner headerButton">
                    <Nav.Link style={{ color: "white" }} className="header-btn">
                      ABOUT US
                    </Nav.Link>
                  </Button>
                  {/* </Nav> */}
                </Navbar.Collapse>
              </Navbar>
            </Col>
          </Row>
          <Row className="main-body-container">
            <center className="main-body-center">
              {/* <br /> */}
              <div id="main_body">
                <Card>
                  <Card.Header className="overview-header">
                    Annotation Visualization of {this.state.orgName} -{" "}
                    {this.state.cleanOrg}
                  </Card.Header>
                  <Card.Header className="graph-actions">
                    <InputGroup>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="dropdown-basic-button"
                          title={this.state.dd}
                          className="dd-outer"
                          disabled
                        >
                          {this.state.dd}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dd-color"></Dropdown.Menu>
                      </Dropdown>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <FormControl
                        className="location-search"
                        id="locationTxt"
                        placeholder="Search by Location"
                        aria-label="Enter Location"
                        style={{ borderRadius: "30rem" }}
                        disabled
                      />
                      <Button variant="light" className="graph-overview">
                        <abbr title="View Summary">
                          <i className="fa fa-pie-chart fa-lg"></i>
                        </abbr>
                      </Button>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Dropdown>
                        <Dropdown.Toggle
                          id="geneSearch"
                          variant="outline-secondary"
                          className="dd-outer b-width"
                          disabled
                        >
                          Search by Gene Name <i className="fa fa-search"></i>
                        </Dropdown.Toggle>
                      </Dropdown>
                    </InputGroup>
                  </Card.Header>
                </Card>
                <div id="graph">
                  <div className="load">
                    <Loading />
                  </div>
                  <div id="graphContent"></div>
                </div>
              </div>
            </center>
          </Row>
          {/* footer */}
          <Row>
            <Footer />
          </Row>
        </Container>
      );
    } else {
      // The forwardRef is important!!
      // Dropdown needs access to the DOM node in order to position the Menu

      // forwardRef again here!
      // Dropdown needs access to the DOM of the Menu to measure it
      const CustomMenu = React.forwardRef(
        ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
          const [value, setValue] = React.useState("");

          return (
            <div
              ref={ref}
              style={style}
              className={className}
              aria-labelledby={labeledBy}
            >
              <FormControl
                autoFocus
                className="mx-3 my-2 w-auto"
                placeholder="Type to filter.."
                onChange={e => setValue(e.target.value)}
                id="filterGene"
                value={value}
              />

              <ul className="list-unstyled">
                {React.Children.toArray(children).filter(
                  child =>
                    !value ||
                    child.props.children
                      .toLowerCase()
                      .startsWith(value.toLowerCase())
                )}
              </ul>
            </div>
          );
        }
      );
      return (
        <Container fluid={true}>
          <Row className="header">
            <Col className="header">
              <Navbar expand="lg">
                <Navbar.Brand href="/">
                  <Logo />
                </Navbar.Brand>
                <Image
                  src="banner-alt.png"
                  className="banner"
                  id="banner"
                  alt="banner"
                />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto"></Nav>
                  <Button variant="link" className="square-corner headerButton">
                    <Nav.Link
                      className="header-btn"
                      style={{ color: "white" }}
                      href="/"
                    >
                      HOME
                    </Nav.Link>
                  </Button>
                  <Button variant="link" className="square-corner headerButton">
                    <Nav.Link
                      className="header-btn"
                      style={{ color: "white" }}
                      onClick={() =>
                        (window.location.href =
                          "http://" + IP + ":3000/?showAll")
                      }
                    >
                      OVERVIEW
                    </Nav.Link>
                  </Button>
                  <Button variant="link" className="square-corner headerButton">
                    <Nav.Link
                      className="header-btn"
                      style={{ color: "white" }}
                      onClick={() =>
                        (window.location.href =
                          "http://" + IP + ":3000/?showAll")
                      }
                    >
                      ABOUT US
                    </Nav.Link>
                  </Button>
                  {/* </Nav> */}
                </Navbar.Collapse>
              </Navbar>
            </Col>
          </Row>

          <Row className="main-body-container">
            <center className="main-body-center">
              {/* <br /> */}
              <div id="main_body">
                <Card>
                  <Card.Header className="overview-header">
                    Annotation Visualization of {this.state.orgName} -{" "}
                    {this.state.cleanOrg}
                  </Card.Header>
                  <Card.Header className="graph-actions">
                    <InputGroup>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="dropdown-basic-button"
                          title={this.state.dd}
                          className="dd-outer"
                        >
                          {this.state.dd}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dd-color">
                          <Dropdown.Item
                            name={this.state.gFile}
                            id={this.state.gFile}
                            variant="light"
                            onClick={this.downloadFile}
                          >
                            Whole Genome Sequence
                          </Dropdown.Item>

                          <Dropdown.Item
                            name={this.state.fileName}
                            id={this.state.fileName}
                            variant="light"
                            onClick={this.downloadFile}
                          >
                            All Annotated Sequences
                          </Dropdown.Item>

                          <Dropdown.Item
                            name={this.state.gFile}
                            id={this.state.gFile}
                            variant="light"
                            onClick={this.loadDownloadPopUp}
                          >
                            By Location
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <FormControl
                        className="location-search"
                        id="locationTxt"
                        placeholder="Search by Location"
                        aria-label="Enter Location"
                        style={{ borderRadius: "30rem" }}
                        onChange={this.find}
                      />
                      <Button
                        variant="light"
                        className="graph-overview"
                        onClick={this.loadSummaryPopUp}
                      >
                        <abbr title="View Summary">
                          <i className="fa fa-pie-chart fa-lg fa-pie-hover"></i>
                        </abbr>
                      </Button>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Dropdown>
                        <Dropdown.Toggle
                          id="geneSearch"
                          variant="outline-secondary"
                          className="dd-outer b-width"
                        >
                          Search by Gene Name <i className="fa fa-search"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu as={CustomMenu} className="dd-color">
                          {this.state.ddList}
                        </Dropdown.Menu>
                      </Dropdown>
                      <GInfo
                        show={this.state.infoPopUpShow}
                        onHide={infoPopUpClose}
                        orgname={this.state.name}
                        start={this.state.start}
                        end={this.state.end}
                        GeneName={this.state.GeneName}
                        LocusTag={this.state.LocusTag}
                        ProteinSequence={this.state.ProteinSequence}
                        NucSequence={this.state.NucSequence}
                      />
                      <RepilconInfo
                        show={this.state.infoPopUpShow}
                        onHide={infoPopUpClose}
                        orgname={this.state.name}
                        start={this.state.start}
                        end={this.state.end}
                        GeneName={this.state.GeneName}
                        LocusTag={this.state.LocusTag}
                        ProteinSequence={this.state.ProteinSequence}
                        NucSequence={this.state.NucSequence}
                      />
                      <GeneSearchResult
                        show={this.state.geneResultShow}
                        onHide={geneResultClose}
                        genedata={this.state.geneResult}
                      />
                      <DownloadByLoc
                        show={this.state.downloadShow}
                        onHide={downloadClose}
                        org={this.state.orgName}
                        gfile={this.state.gFile}
                      />
                      <Summary
                        show={this.state.summaryShow}
                        onHide={summaryClose}
                        orgname={this.state.orgName}
                        totalgenes={this.state.totalGenes}
                        labelledgenes={this.state.labelledGenes}
                        unlabelledgenes={this.state.unlabelledGene}
                        uniquegenes={this.state.uniqueGenes}
                        gLength={this.state.genomeLength}
                      />
                    </InputGroup>
                  </Card.Header>
                </Card>
                <div id="graph">
                  {this.state.page}
                  <div id="graphContent"></div>
                </div>
              </div>
            </center>
          </Row>
          {/* footer */}
          <Row>
            <Footer />
          </Row>
        </Container>
      );
    }
  }
}

export default Graph;
