import React, { Component } from "react";
import { Modal, Button, Image } from "react-bootstrap";
import "./font-awesome/css/font-awesome.min.css";
import "./styles.css";
import axios from "axios";

const IP = require("./ipconfig.js");

export class UpdatePics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageComp: [],
      images: [],
      deleteImage: []
    };
  }

  uploadPic = async () => {
    const data = new FormData();
    data.append("file", document.getElementById("newImgFile").files[0]);

    var dirPath = this.props.orgname + "/";

    await axios
      .post("http://" + IP + ":8000/upload", data, {
        headers: { path: dirPath }
      })
      .then(res => {
        console.log(res.statusText);
      });
  };

  update = async () => {
    let originalImage = this.state.images;
    let toDelete = this.state.deleteImage;

    let difference = originalImage.filter(x => !toDelete.includes(x));
    let newImage = "";

    if (
      document.getElementById("newImage").src !==
      "https://image.flaticon.com/icons/png/128/149/149145.png"
    ) {
      newImage = document.getElementById("newImgFile").files[0]["name"];
      difference.push(newImage);
      this.uploadPic();
    }

    const data = new URLSearchParams();
    data.append("images", difference);
    data.append("orgName", this.props.orgname);
    data.append("toDelete", toDelete);

    await axios.post("http://localhost:8000/updateImages", data).then(res => {
      this.setState({
        deleteImage: []
      });
    });
    document.getElementById("refresh-btn").click();
    this.props.onHide();
  };

  discardChanges = () => {
    this.setState({
      deleteImage: []
    });
    this.props.onHide();
  };

  getImage = id => {
    document.getElementById(id).click();
    console.log(document.getElementById(id).files[0]);
  };

  openImage = imageName => {
    let loc =
      "http://localhost:8000/getImage?i=" +
      imageName +
      "&o=" +
      this.props.orgname;
    window.open(loc, "_blank");
  };

  deleteImage = image => {
    document.getElementById(image).hidden = true;

    let temp = this.state.deleteImage;
    temp.push(image);

    this.setState({
      deleteImage: temp
    });
  };

  loadFile = event => {
    var output = document.getElementById("newImage");
    if (document.getElementById("newImgFile").files[0] !== undefined) {
      output.src = URL.createObjectURL(
        document.getElementById("newImgFile").files[0]
      );
    } else {
      output.src = "https://image.flaticon.com/icons/png/128/149/149145.png";
    }
  };

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    let comps = [];
    let i = 0;
    nextProps.images.forEach(image => {
      let loc =
        "http://localhost:8000/getImage?i=" + image + "&o=" + nextProps.orgname;

      i = i + 1;
      comps.push(
        <div className="img-container left" id={image} key={i}>
          <Image
            alt="org"
            key={image}
            height="200px"
            width="200px"
            className="update-image-img"
            src={loc}
          />

          <div className="middle" key={"middle" + { i }}>
            <div className="add-content" key={"add-content" + { i }}>
              <abbr title="View image" key={"view-image" + { i }}>
                <i
                  className="fa fa-eye fa-3x"
                  onClick={() => {
                    this.openImage(image);
                  }}
                  key={"eye" + { i }}
                ></i>
              </abbr>
              &nbsp;&nbsp;
              <abbr title="Delete image" key={"del-img" + { i }}>
                <i
                  className="fa fa-trash fa-3x"
                  id={image}
                  onClick={() => {
                    this.deleteImage(image);
                  }}
                  key={"del" + { i }}
                ></i>
              </abbr>
            </div>
          </div>
        </div>
      );
    });

    i = 100;

    comps.push(
      <div className="img-container left" key={"new" + { i }}>
        <input
          id="newImgFile"
          type="file"
          onChange={() => this.loadFile()}
          style={{ display: "none" }}
          key={"newImg" + { i }}
        />
        <abbr title="Add New Image" key={"newAbbr" + { i }}>
          <Button
            variant="light"
            className="addnew-image-btn"
            onClick={() => {
              this.getImage("newImgFile");
            }}
            key={"newBtn" + { i }}
          >
            <Image
              id="newImage"
              key="newImg"
              className="update-image-img"
              height="200px"
              width="200px"
              alt="Add New Image"
              src="https://image.flaticon.com/icons/png/128/149/149145.png"
            />
          </Button>
        </abbr>
      </div>
    );

    this.setState({
      imageComp: comps,
      images: nextProps.images
    });
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={"static"}
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Pictures for {this.props.orgname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="update-image-body">
          <div>{this.state.imageComp}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            name="closeBtn"
            id="closeBtn"
            onClick={this.discardChanges}
          >
            Close
          </Button>
          <Button
            variant="success"
            name="downloadBtn"
            id="downloadBtn"
            onClick={() => this.update()}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
