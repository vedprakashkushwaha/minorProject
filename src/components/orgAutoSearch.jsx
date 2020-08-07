import React from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import "./styles.css";
import OrgDetails from "./orgDetails";
import { FaSearch } from "react-icons/fa";

const IP = require("./ipconfig.js");

class OrgList extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      listComp: <List items={[]} alldata={[]} refresh={this.loadData} />
    };
    this.loadData = this.loadData.bind(this);
  }

  loadData = async () => {
    const url = "http://" + IP + ":8000/api.organism.details";
    const respose = await fetch(url);
    const data = await respose.json();
    var i = 0;
    var d = [];
    for (i = 0; i < data["results"].length; i++) {
      d.push(data["results"][i]["name"]);
    }
    // if (this._isMounted) {
    await this.setState({
      list: d,
      totalData: data["results"],
      loading: true,
      listComp: (
        <List items={d} alldata={data["results"]} refresh={this.loadData} />
      )
    });
    // }
  };

  async componentDidMount() {
    this._isMounted = true;
    this.loadData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="content">
        <div className="container">
          <section className="section">
            {this.state.listComp}
            {/* <List
              items={this.state.list}
              alldata={this.state.totalData}
              refresh={this.loadData}
            /> */}
          </section>
        </div>
      </div>
    );
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      selectedOrg: "",
      name: "",
      type: "",
      desc: "",
      index: 0,
      images: [],
      orgdetails: <OrgDetails orgname="Organism" />
    };
    this.handleChange = this.handleChange.bind(this);
    this.getOrgName = this.getOrgName.bind(this);
  }

  componentDidMount() {
    this.setState({
      filtered: this.props.items
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filtered: nextProps.items
    });
  }

  handleChange(e) {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      // Assign the original list to currentList
      currentList = this.props.items;

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter(item => {
        // change current item to lowercase
        const lc = item.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
    } else {
      // If the search bar is empty, set newList to original task list
      newList = this.props.items;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      filtered: newList
    });
  }

  async getOrgName(event) {
    await this.setState({
      selectedOrg: event.target.id,
      index: event.target.className
    });
    // console.log(this.props.alldata.length);
    for (var i = 0; i < this.props.alldata.length; i++) {
      if (this.state.selectedOrg === this.props.alldata[i]["name"]) {
        this.setState({
          name: this.props.alldata[i]["name"],
          type: this.props.alldata[i]["type"],
          desc: this.props.alldata[i]["desc"],
          coll: this.props.alldata[i]["coll"],
          images: this.props.alldata[i]["images"]
        });
        break;
      }
    }

    this.setState({
      orgdetails: (
        <OrgDetails
          orgname={this.state.selectedOrg}
          orgtype={this.state.type}
          orgdesc={this.state.desc}
          orgcoll={this.state.coll}
          orgimages={this.state.images}
        />
      )
    });
  }

  refreshPage = () => {
    this.props.refresh();
    this.setState({
      selectedOrg: "",
      type: "",
      desc: "",
      coll: "",
      orgdetails: (
        <OrgDetails
          orgname="Organism"
          orgtype=""
          orgdesc=""
          orgcoll=""
          orgimages={[]}
        />
      )
    });

    // window.location.href = "http://"+IP+":3000/admin";
  };

  addNew = () => {
    window.location.href = "http://" + IP + ":3000/godMode?cmd=addneworg";
  };

  render() {
    return (
      <div id="orgSearch">
        <Card className="org-list" style={{}}>
          <Card.Header className="overview-header">
            <center>Organism List</center>
          </Card.Header>

          <Card.Body className="scrollbar x-hidden" id="style-1">
            <InputGroup className="admin-search-org">
              <Form.Control
                name="organismName"
                id="searchOrganism"
                type="text"
                onChange={this.handleChange}
                placeholder="Enter organism name"
              />
              <i id="filtersubmit">
                <FaSearch />
              </i>
              &nbsp;&nbsp;
              <Button
                variant="light"
                id="refresh-btn"
                className="refresh-btn"
                onClick={this.refreshPage}
                style={{ borderRadius: "50%" }}
              ></Button>
            </InputGroup>

            <div style={{ height: "10px" }}></div>

            {/* <Accordion> */}
            {this.state.filtered.map((item, index) => (
              <Card id="orgHeading" key={item}>
                <Card.Header className="org-auto-search-list show-pointer">
                  <p id={item} className={index} onClick={this.getOrgName}>
                    {item}
                  </p>
                </Card.Header>
              </Card>
            ))}
            {/* </Accordion> */}
          </Card.Body>
          <Button
            variant="secondary"
            onClick={() => this.addNew()}
            style={{ borderRadius: "0rem" }}
            block
          >
            + Add New Record
          </Button>
        </Card>

        <div id="orgDetail">{this.state.orgdetails}</div>
      </div>
    );
  }
}
export default OrgList;
