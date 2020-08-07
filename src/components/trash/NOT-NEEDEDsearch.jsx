import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

class SearchBox extends Component {
  render() {
    return (
      <InputGroup className="mb-3 m-2" style={{ top: 300 }}>
        <FormControl
          style={{
            // borderRadius: 40,
            height: 60,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderColor: "white",
            borderRight: "transparent",
            color: "white",
            marginLeft: "10%",
            borderTopLeftRadius: 40,
            borderBottomLeftRadius: 40
            // marginRight: "10%"
          }}
          placeholder="Type organism name.."
          aria-label="Organism"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Prepend style={{ marginRight: "10%" }}>
          <InputGroup.Text
            style={{
              opacity: 0.5,
              borderColor: "white",
              borderTopRightRadius: 40,
              borderBottomRightRadius: 40,
              width: 70
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              size="lg"
              // style={{ borderColor: "red" }}
            />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <InputGroup.Append></InputGroup.Append>
      </InputGroup>
    );
  }
}

export default SearchBox;
