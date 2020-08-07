import React from "react";
import "./styles.css";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

class HeaderMenuButtons extends React.Component {
  render() {
    return (
      <ButtonGroup
        size="lg"
        style={{
          paddingTop: 50
        }}
      >
        <Button
          variant="secondary"
          style={{
            borderColor: "transparent",
            backgroundColor: "rgba(51, 63, 80, 0.5)",
            borderBottomLeftRadius: 50,
            borderTopLeftRadius: 50,
            height: "140%"
          }}
          href="home"
        >
          Home
        </Button>

        <Button
          variant="secondary"
          style={{
            borderColor: "transparent",
            backgroundColor: "rgba(51, 63, 80, 0.5)",
            height: "140%"
          }}
          href="orgInfo"
        >
          Info
        </Button>
        <Button
          // className="header-menu-button"
          variant="secondary"
          style={{
            borderColor: "transparent",
            backgroundColor: "rgba(51, 63, 80, 0.5)",
            borderBottomRightRadius: 50,
            borderTopRightRadius: 50,
            height: "140%"
          }}
          href="there"
        >
          There
        </Button>
      </ButtonGroup>
    );
  }
}

export default HeaderMenuButtons;
