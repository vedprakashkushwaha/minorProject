import React from "react";
import Image from "react-bootstrap/Image";

const IP = require("./ipconfig.js");
class Logo extends React.Component {
  render() {
    let home = "http://" + IP + ":3000/?home";

    return (
      <div style={{ height: 150, width: 190, marginLeft: "-50px" }}>
        <a href={home}>
          <Image src="favicon.ico" height="100%" fluid />
        </a>
      </div>
    );
  }
}

export default Logo;
