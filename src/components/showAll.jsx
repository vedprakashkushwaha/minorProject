import React from "react";
import { Button, Card } from "react-bootstrap";

const IP = require("./ipconfig.js");

class ShowAll extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  async componentDidMount() {
    const url = "http://" + IP + ":8000/api.organism.details";
    const respose = await fetch(url);
    const data = await respose.json();
    this.setState({
      data: data["results"],
      loading: true
    });
  }

  fetchInfo(event) {
    window.location.href = "http://" + IP + ":3000/?orgName=" + event.target.id;
  }

  render() {
    return (
      <Card className="scrollbar show-all" id="style-1">
        <Card.Header className="overview-header">
          <center>All Organisms</center>
        </Card.Header>
        <Card.Body className="scrollbar" id="style-1">
          {this.state.data.map((object, index) => (
            <Card className="show-all-inner-cards">
              <Card.Body>
                <abbr title={object["name"]}>
                  <Card.Title className="show-pointer no-decor" key={index}>
                    {object["name"].slice(0, 30)}
                  </Card.Title>
                </abbr>
                <abbr title={object["type"]}>
                  <Card.Text className="show-pointer no-decor">
                    {object["type"].slice(0, 50)}
                  </Card.Text>
                </abbr>
              </Card.Body>
              <Card.Footer className="show-all-inner-cards-footer">
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="more-info-btn"
                  id={object["name"]}
                  onClick={this.fetchInfo}
                >
                  More>>
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </Card.Body>
      </Card>
    );
  }
}

export default ShowAll;
