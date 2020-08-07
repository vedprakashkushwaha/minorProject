constructor() {
    /* 1. Initialize Ref */
    super();
    this.organismName = React.createRef();
    this.organismType = React.createRef();
    this.organismDesc = React.createRef();
  }

  handleChange() {
    /* 3. Get Ref Value here (or anywhere in the code!) */
    const value = this.textInput.current.value;
    console.log(value);
  }

  onSubmit() {
    const orgName = this.organismName.current.value;
    const orgType = this.organismType.current.value;
    const orgDesc = this.organismDesc.current.value;

    let orgDetails = {};
    orgDetails["name"] = orgName;
    orgDetails["type"] = orgType;
    orgDetails["desc"] = orgDesc;

    console.log(orgDetails);
    // db.connect(orgDetails, "orgDetails", "orgDescription");
  }