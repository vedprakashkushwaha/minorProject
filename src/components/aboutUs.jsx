import React, { Component } from "react";
import { Container, Row, Col, Image, Form, Card } from "react-bootstrap";

class AboutUs extends Component {
  render() {
    return (
      <Container fluid>
        <center>
          <Card className="about-us-div">
            <Card.Body>
              <Card.Text className="about-us-text">
                This web application was built under the supervision of Prof.
                Satapathy and in collaboration with the MBBT department of
                Tezpur University to help in their research on the Molecular
                Biodiversity in North Eastern States. Our goal is to facilitate
                their research work on the extraction and isolation of the DNA
                of major plant pathogens. The intent of their research is to
                identify the disease causing genome in pathogens like Ralstonia
                Solanacearum. If successful, it will help put a stop to the
                intrusion and lasting infection caused by such plant pathogens.
              </Card.Text>
              {/* <hr /> */}

              <Row>
                <Col>
                  <div class="img-container">
                    <Image
                      className="update-image-img"
                      src="https://www.puntocarautomobili.it/wp-content/uploads/2019/01/avataaars.png"
                      height="250"
                      width="250"
                      roundedCircle
                    />
                    <div className="middle">
                      <div class="add-content">
                        <i
                          className="fa fa-facebook fa-2x"
                          onClick={() => {
                            window.open(
                              "http://agnigarh.tezu.ernet.in/~ssankar/index.html",
                              "_blank"
                            );
                          }}
                        ></i>
                        &nbsp;
                        <i
                          className="fa fa-user fa-2x"
                          onClick={() => {
                            window.open(
                              "http://agnigarh.tezu.ernet.in/~ssankar/index.html",
                              "_blank"
                            );
                          }}
                        ></i>
                        <span style={{ color: "black" }}>Project Mentor</span>
                      </div>
                    </div>
                    <br />
                    <Form.Label className="about-us-labels">
                      Prof. S.S. Satapathy
                    </Form.Label>
                  </div>
                </Col>
                <Col>
                  <div class="img-container">
                    <Image
                      className="update-image-img"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ678p4XTXw8-FFJVhPLBU-R8IsiifApuU734-_JOJrKZ1Rvdxh&s"
                      height="250"
                      width="250"
                      roundedCircle
                    />
                    <div className="middle">
                      <div className="add-content">
                        <i
                          className="fa fa-facebook fa-2x"
                          onClick={() => {
                            window.open(
                              "https://www.facebook.com/profile.php?id=100009981280454",
                              "_blank"
                            );
                          }}
                        ></i>
                        &nbsp;
                        <i
                          className="fa fa-github fa-2x"
                          onClick={() => {
                            window.open(
                              "https://github.com/Nawajish",
                              "_blank"
                            );
                          }}
                        ></i>
                      </div>
                    </div>
                    <br />
                    <Form.Label className="about-us-labels">
                      Nawajish Laskar
                    </Form.Label>
                  </div>
                </Col>
                <Col>
                  <div className="img-container">
                    <Image
                      className="update-image-img"
                      src="https://x.dpstatic.com/d/avatars/l/905/905144.jpg?1511195787"
                      height="250"
                      width="250"
                      roundedCircle
                    />
                    <div className="middle">
                      <div className="add-content">
                        <i
                          className="fa fa-facebook fa-2x"
                          onClick={() => {
                            window.open(
                              "https://www.facebook.com/amannv2",
                              "_blank"
                            );
                          }}
                        ></i>
                        &nbsp;
                        <i
                          className="fa fa-github fa-2x"
                          onClick={() => {
                            window.open("https://github.com/amannv2", "_blank");
                          }}
                        ></i>
                      </div>
                    </div>
                    <br />
                    <Form.Label className="about-us-labels">
                      Aman Verma
                    </Form.Label>
                  </div>
                </Col>
                <Col>
                  <div className="img-container">
                    <Image
                      className="update-image-img"
                      src="https://ideax.rs/wp-content/uploads/2019/05/avataaars3.png"
                      height="250"
                      width="250"
                      roundedCircle
                    />
                    <div className="middle">
                      <div className="add-content">
                        <i
                          className="fa fa-facebook fa-2x"
                          onClick={() => {
                            window.open(
                              "https://www.facebook.com/bed.prakash.71",
                              "_blank"
                            );
                          }}
                        ></i>
                        &nbsp;
                        <i
                          className="fa fa-github fa-2x"
                          onClick={() => {
                            window.open(
                              "https://github.com/vedprakashkushwaha",
                              "_blank"
                            );
                          }}
                        ></i>
                      </div>
                    </div>
                    <br />
                    <Form.Label className="about-us-labels">
                      Bed Prakash
                    </Form.Label>
                  </div>
                </Col>
              </Row>
              {/* <hr /> */}
              <Card.Text className="about-us-text">
                Our team consists of Aman, Bed and Nawajish. We built this web
                application using the MERN (MongoDB-Express-React-Node) stack to
                assist in the evaluation of extracted pathogens. It parses
                uploaded genome data and creates a interactive visualization of
                the ATGC sequence within. The researcher can then search for
                specific gene sequences (by name or location) or download a
                particular sequence. We used React.js to built a fast and sleek
                user interface with Node.js handling requests in the backend. As
                we worked with large amounts of data, our database of choice was
                MongoDB. It is a NoSQL database which is highly scalable and
                malleable. Express.js manages all the traffic between the front
                and the back of the application.
              </Card.Text>
            </Card.Body>
          </Card>
        </center>
      </Container>
    );
  }
}

export default AboutUs;
