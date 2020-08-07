import React, { Component } from "react";
import { Figure } from "react-bootstrap";
import Logo from "./logo";

class ErrorPage extends Component {
  render() {
    return (
      <div className="error-container">
        <div className="error-msg">
          <Figure style={{ width: "800px" }}>
            <Figure.Image
              width={250}
              height={250}
              alt="ERRORimage"
              src="https://learn.genetics.utah.edu/content/basics/telomeres/images/brokendna.jpg"
              style={{
                float: "right",
                borderRadius: "100em"
              }}
            />
            <div
              style={{
                marginTop: "10px",
                fontSize: "25px"
              }}
            >
              <div>
                <Logo />
              </div>
              <p>
                <b>404.</b> <ins>That’s an error.</ins>
              </p>
              <p>
                The requested URL was not found on this server.
                <br />
                <ins>That’s all we know.</ins>
              </p>
            </div>
          </Figure>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
