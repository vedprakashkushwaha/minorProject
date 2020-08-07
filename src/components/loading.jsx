import React, { Component } from "react";
import "./styles.css";
import "bootstrap";

class Loading extends Component {
  render() {
    return (
      <center>
        <div className="outer-div" style={{ background: "transparent" }}>
          <span className="overview-header">
            <br />
            <center> Please Wait </center>
          </span>
          <br />
          <img
            alt="loadingImage"
            width="400px"
            src="https://inflammation-systemicenzymes.com/wp-content/uploads/2018/11/dna.gif"
          ></img>
          <br />
          <br />
        </div>
      </center>
    );
  }
}

export default Loading;
