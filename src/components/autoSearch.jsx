import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "./styles.css";

const IP = require("./ipconfig.js");
const fetch = require("node-fetch");
const Bluebird = require("bluebird");
fetch.Promise = Bluebird;

class AutoSearch extends React.Component {
  state = {
    selected: [],
    loading: true,
    organismName: []
  };

  async componentDidMount() {
    const url = "http://" + IP + ":8000/api.organism.name";
    const respose = await fetch(url);
    const data = await respose.json();
    this.setState({
      organismName: data["results"],
      loading: true
    });
  }

  fetchDetails(selectedOptions) {
    if (selectedOptions !== "") {
      window.location.href =
        "http://" + IP + ":3000/?orgName=" + selectedOptions;
    }
  }

  render() {
    return (
      <div className="autosearch-div">
        <Typeahead
          className="typeahead-comp"
          name="orgName"
          {...this.state}
          id="query-box"
          options={this.state.organismName}
          onChange={this.fetchDetails}
          placeholder={"Choose Any Organism"}
        />
      </div>
    );
  }
}

export default AutoSearch;
