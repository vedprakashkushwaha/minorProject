import React from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

class AddNew extends React.Component {
  render() {
    return (
      <a href="addNewOrganism">
        <Button
          size="lg"
          style={{
            float: "right",
            marginTop: "1.8%",
            borderRadius: 100,
            background: "#941107",
            borderColor: "#941107",
            height: "55%"
          }}
        >
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </Button>
      </a>
    );
  }
}

export default AddNew;
