var express = require("express");
var app = express();
var multer = require("multer");
var cors = require("cors");
const mongoUtil = require("./mongoUtil");
var bodyParser = require("body-parser");
var url1 = require("url");
var mkdirp = require("mkdirp");
var fs = require("fs");
var nodemailer = require("nodemailer");

app.use(cors());
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var path = __dirname + "/uploads/" + req.headers.path;

    let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
    let day = new Date().toLocaleString();
    let logTime = "[" + day + "]\t";
    let message =
      "Uploading new file '" +
      file.originalname +
      "' at location " +
      path +
      ". ";
    logFile.write("\n" + logTime + " " + message);
    console.log("\n" + logTime + " " + message);

    mkdirp(path, function (err) {
      if (err) throw err;
      cb(null, path);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
}).single("file");

// support function for /api.organism.name
function accessOrganismName(response) {
  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();
  // console.log(db);
  db.collection(collectionName)
    .find(
      {},
      {
        projection: {
          name: 1,
          _id: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;

      var array = [];
      resD.forEach(function (item) {
        array.push(item.name);
      });
      var json = JSON.stringify({
        results: array
      });
      response.end(json);
    });
}

// support function for /api.organism.details
function accessAllOrganismDetails(response) {
  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();
  db.collection(collectionName)
    .find(
      {},
      {
        projection: {
          _id: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;

      var json = JSON.stringify({
        results: resD
      });
      response.end(json);
    });
}

// support function for /api.singleOrganism.details
async function accessSingleOrganismDetails(response, oName) {
  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();
  db.collection(collectionName)
    .find(
      {
        name: oName
      },
      {
        projection: {
          _id: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;
      var json = JSON.stringify({
        results: resD
      });
      response.end(json);
    });
}

async function accessSingleCellDetails(response, name, start, end) {
  let collectionName = name;
  const db = mongoUtil.getDb();
  db.collection(collectionName)
    .find(
      {
        StartPosition: start,
        EndPosition: end
      },
      {
        projection: {
          _id: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;
      var json = JSON.stringify({
        results: resD
      });

      response.end(json);
    });
}

// support function for /updateOrganism
var updateInfo = (oldName, newName, newType, newDesc, response) => {
  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "Updated data of " + newName + ". ";
  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);

  db.collection(collectionName).updateOne(
    {
      name: oldName
    },
    {
      $set: {
        name: newName,
        type: newType,
        desc: newDesc
      }
    }
  );
  response.end();
};

async function crearteRequireDataForGraph(loc) {
  var loc1 = [];

  for (let i = 0; i < loc.length; i++) {
    if (loc[i].StartPosition == null || loc[i].EndPosition == null) continue;
    if (parseInt(loc[i].StartPosition) < parseInt(loc[i].EndPosition)) {
      loc1.push({
        serial: i,
        StartPosition: loc[i].StartPosition,
        EndPosition: loc[i].EndPosition,
        width: parseInt(loc[i].EndPosition) - parseInt(loc[i].StartPosition),
        Strand: loc[i].Strand,
        GeneName: loc[i].GeneName
      });
    } else {
      loc1.push({
        serial: i,
        StartPosition: loc[i].StartPosition,
        EndPosition: loc[i].StartPosition,
        width: parseInt(loc[i].EndPosition) - parseInt(loc[i].EndPosition),
        Strand: loc[i].Strand,
        GeneName: loc[i].GeneName
      });
    }
  }
  return loc1;
}

async function accessLocationForGraph(res, collectionName) {
  const db = mongoUtil.getDb();
  db.collection(collectionName)
    .find(
      {},
      {
        projection: {
          _id: 0,
          StartPosition: 1,
          EndPosition: 1,
          Strand: 1,
          GeneName: 1
        }
      }
    )
    .toArray(async function (err, resD) {
      if (err) throw err;

      var loc = await crearteRequireDataForGraph(resD);
      var json = JSON.stringify({
        results: loc
      });
      res.end(json);
    });
}

// retrieve all organisms name
app.get("/api.organism.name", function (req, res) {
  accessOrganismName(res);
});

app.get("/api.gene.location", urlencodedParser, async function (req, res) {
  var q = url1.parse(req.url, true);
  var qData = q.query;
  var collectionName = qData.collectionName;
  await accessLocationForGraph(res, collectionName);
});

// retrieve all organisms details
app.get("/api.organism.details", function (req, res) {
  accessAllOrganismDetails(res);
});

// retrieve single organisms details
app.get("/api.singleOrganism.details", urlencodedParser, async function (
  req,
  res
) {
  var q = url1.parse(req.url, true);
  var qData = q.query;
  var orgName = qData.orgName;
  // console.log("count: " + req.url);
  await accessSingleOrganismDetails(res, orgName);
});

app.get("/api.singleCell.details", urlencodedParser, async function (req, res) {
  var q = url1.parse(req.url, true);
  var qData = q.query;
  var name = qData.name;
  var start = qData.start;
  var end = qData.end;

  await accessSingleCellDetails(res, name, start, end);
});

// upload file to server
app.post("/upload", async function (req, res) {
  await upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(201).json();
  });
});

// update org details
app.post("/updateOrganism", urlencodedParser, async function (req, res) {
  let newName = req.body.newName;
  let newType = req.body.newType;
  let newDesc = req.body.newDesc;
  let oldName = req.body.oldName;

  await updateInfo(oldName, newName, newType, newDesc, res);

  res.end();
});

app.post("/deleteOrganism", urlencodedParser, async function (req, res) {
  let oName = req.body.oName;
  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "";

  db.collection(collectionName)
    .find(
      {
        name: oName
      },
      {
        projection: {
          _id: 0,
          type: 0,
          desc: 0,
          genomefiles: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;

      var json = JSON.stringify({
        results: resD
      });

      var filesToDelete = resD[0].coll;
      // delete Organism from orgDetails
      db.collection(collectionName).deleteOne(
        {
          name: oName
        },
        function (err, obj) {
          if (err) throw err;
        }
      );
      message = message + "Deleted organism: " + oName + ". ";
      message = message + "Deleting it's replicons: ";
      // delete all coll of organism from DB
      if (filesToDelete.length !== 0) {
        filesToDelete.forEach(element => {
          db.collection(element).drop(function (err, delOK) {
            if (err) throw err;
            if (delOK) {
              message = message + "Deleted " + element + ". ";
            }
          });
        });
      }

      logFile.write("\n" + logTime + " " + message);
      console.log("\n" + logTime + " " + message);
      res.end(json);
    });
  res.end();
});

// add new org to db
app.post("/orgDesc", urlencodedParser, function (req, res) {
  var orgName = req.body.organismName;
  var collName = "orgDetails";
  var orgType = req.body.organismType;
  var orgDesc = req.body.organismDesc;
  var images = [];
  const db = mongoUtil.getDb();

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "Creating new organism: " + orgName + ". ";

  for (let index = 1; index <= 4; index++) {
    var property = "pic" + index;
    if (req.body[property] !== "") images.push(req.body[property]);
  }

  var data = [
    {
      name: orgName,
      type: orgType,
      desc: orgDesc,
      coll: [],
      genomefiles: [],
      images: images
    }
  ];

  db.collection(collName).insertMany(data, function (err) {
    if (err) throw err;
    message = message + "Successfully inserted data into the " + orgName + ". ";
  });

  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);

  return res.redirect("http://localhost:3000/godMode?orgName=" + orgName);
});

mongoUtil.connectToServer(function (err, client) {
  if (err) console.log(err);
  app.listen(8000, function () {
    console.log("Server Started. App running on port 8000");
  });
});

// support function for /deleteReplicon
function fetchReplicons(response, oName) {
  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();

  db.collection(collectionName)
    .find(
      {
        name: oName
      },
      {
        projection: {
          _id: 0,
          name: 0,
          type: 0,
          desc: 0,
          images: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;

      var json = JSON.stringify({
        results: resD
      });
      response.end(json);
    });
}

// support function for /searchByGene
function fetchInfoByGene(response, gene, coll) {
  const db = mongoUtil.getDb();
  db.collection(coll)
    .find(
      {
        GeneName: gene
      },
      {
        projection: {
          _id: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;

      var json = JSON.stringify({
        results: resD
      });
      response.end(json);
    });
}

// support function for /deleteReplicon
async function deleteFiles(res, aFile) {
  const db = mongoUtil.getDb();
  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "";

  db.collection(aFile).drop(function (err, delOK) {
    if (err) throw err;
    if (delOK) {
      message = message + "Deleted " + aFile + ". ";
    }
  });
  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);

  res.end();
}

app.post("/deleteReplicon", urlencodedParser, async function (req, res) {
  let aFile = req.body.aFile;

  let aList = req.body.aList;
  let gList = req.body.gList;

  let oName = req.body.oName;

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "Deleting replicons from " + oName + ". ";
  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);

  await deleteFiles(res, aFile);
  await updateFiles(res, aList, gList, oName);
});

// support function for /deleteReplicon
async function updateFiles(res, aListTemp, gListTemp, oName) {
  var aList = [];
  var gList = [];

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "Updated replicon list in " + oName + ". ";

  if (typeof aListTemp === "string") {
    aList = aListTemp.split(",");
  } else {
    aList = aListTemp;
  }

  if (typeof aListTemp === "string") {
    gList = gListTemp.split(",");
  } else {
    gList = gListTemp;
  }

  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();
  db.collection(collectionName).updateOne(
    {
      name: oName
    },
    {
      $set: {
        coll: aList,
        genomefiles: gList
      }
    }
  );

  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);
  res.end();
}

app.post("/getReplicon", urlencodedParser, function (req, res) {
  var oName = req.body.oName;
  fetchReplicons(res, oName);
});

app.get("/download", urlencodedParser, async function (req, res) {
  var q = url1.parse(req.url, true);
  var data = q.query;

  const path = __dirname + "/uploads/" + data.path;
  res.download(path);
});

app.get("/helpFile", function (req, res) {
  res.sendFile(__dirname + "/imgs/helpFile.jpg");
});

app.post("/searchByGene", urlencodedParser, async function (req, res) {
  var gene = req.body.gene;
  var coll = req.body.coll;
  fetchInfoByGene(res, gene, coll);
});

app.post("/parseFile", urlencodedParser, async function (req, res) {
  var fName = req.body.fName;

  var collName = String(req.body.collName);
  var parentName = req.body.parentName;
  var genomeFile = req.body.genomeFile;

  var json;

  let retVal = await getFileContent(parentName, collName, fName);
  //no error
  if (retVal === "OK") {
    await updateOrgDetails(parentName, collName, genomeFile, res);
    json = JSON.stringify({
      results: "OK"
    });
  } else {
    //some fields are missing
    json = JSON.stringify({
      results: retVal
    });
  }
  res.end(json);
});

// support function for /uploadData
function updateOrgDetails(parent, newData, genomeFiles, response) {
  let collectionName = "orgDetails";
  const db = mongoUtil.getDb();

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = genomeFiles + "'s data has been updated. ";
  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);

  db.collection(collectionName)
    .find(
      {
        name: parent
      },
      {
        projection: {
          _id: 0
        }
      }
    )
    .toArray(function (err, resD) {
      if (err) throw err;

      var json = JSON.stringify({
        results: resD
      });

      var new_collection = resD[0].coll;
      new_collection = new_collection.concat(newData);

      var new_genomeFiles = resD[0].genomefiles;
      new_genomeFiles = new_genomeFiles.concat(genomeFiles);

      db.collection("orgDetails").updateOne(
        {
          name: parent
        },
        {
          $set: {
            coll: new_collection,
            genomefiles: new_genomeFiles
          }
        }
      );

      response.end(json);
    });
}

let insertIntoDB = async (data, parent, collectionName) => {
  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "";

  const db = mongoUtil.getDb();
  db.collection(String(collectionName)).insertMany(data, function (err, res) {
    if (err) throw err;
    message =
      message + collectionName + " has been inserted into " + parent + ". ";
    logFile.write("\n" + logTime + " " + message);
    console.log("\n" + logTime + " " + message);
  });
};

// const fs = require("fs");
let contents = [];

let getFileContent = (orgName, collName, fileName) => {
  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "";

  let filePath = __dirname + "/uploads/" + orgName + "/" + fileName;

  let allFields = {
    Strand: 0,
    StartPosition: 0,
    EndPosition: 0,
    GeneName: 0,
    LocusTag: 0,
    GeneType: 0,
    ProductDescription: 0,
    ProteinSequence: 0,
    NucSequence: 0
  };

  if (filePath === undefined) {
    message =
      message +
      orgName +
      "'s " +
      fileName +
      " has invalid path. " +
      filePath +
      ". ";
    console.log("\n" + logTime + " " + message);
    logFile.write("\n" + logTime + " " + message);
    return;
  }

  let line = fs
    .readFileSync(filePath)
    .toString()
    .split("\n");

  // get all fields
  line[0] = line[0].trim();
  let fields = line[0].split("\t");

  // check if all the required fields are present
  let missing = [];
  let flag = 0;

  // change count to 1 for fields that exists
  for (let i = 0; i < fields.length; i++) {
    let count = allFields[fields[i]];
    if (count !== undefined) {
      allFields[fields[i]] = count + 1;
    }
  }

  // check for missing fields
  for (var key in allFields) {
    if (allFields[key] === 0) {
      missing.push(key);
      flag = 1;
    }
  }

  if (flag) {
    message =
      message +
      orgName +
      "'s " +
      fileName +
      " has less/invalid fields: " +
      missing.toString() +
      ". ";
    console.log("\n" + logTime + " " + message);
    logFile.write("\n" + logTime + " " + message);
    return missing;
  }

  // retrieve all data
  for (let i = 1; i < line.length; i++) {
    line[i].trim();
    let temp = line[i].split("\t");
    let rec = {};

    for (let j = 0; j < fields.length; j++) {
      rec[fields[j]] = temp[j];
    }
    contents.push(rec);
  }

  message =
    message + orgName + "'s " + fileName + " has been parsed successfully. ";

  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);

  insertIntoDB(contents, orgName, collName);
  contents = [];
  return "OK";
};

app.get("/downloadByLoc", urlencodedParser, async function (req, res) {
  let q = url1.parse(req.url, true);
  let data = q.query;

  let start = data.start - 1;
  let end = data.end;
  let action = data.action;

  const path = __dirname + "/uploads/" + data.path;

  let fileContents = "";

  let line = fs
    .readFileSync(path)
    .toString()
    .split("\n");

  let newStart = start + 1;

  let head = line[0] + " (" + newStart + ".." + end + ")\n";

  for (let i = 1; i < line.length; i++) {
    fileContents = fileContents + line[i].trim();
  }

  let filePath = __dirname + "/temp.fasta";
  let finalData = "";

  if (action === "forward") {
    finalData = fileContents.slice(start, end);
  } else {
    let tempData = fileContents.slice(start, end);

    for (let i = tempData.length - 1; i >= 0; i--) {
      if (tempData[i] === "a") {
        finalData = finalData + "t";
      } else if (tempData[i] === "t") {
        finalData = finalData + "a";
      } else if (tempData[i] === "g") {
        finalData = finalData + "c";
      } else {
        finalData = finalData + "g";
      }
    }
  }

  let temp = "";
  for (let i = 0; i < finalData.length; i = i + 60) {
    temp = temp + finalData.slice(i, i + 60) + "\n";
  }
  finalData = temp;

  let dataTobeWritten = head + finalData;

  await fs.writeFileSync(filePath, dataTobeWritten, err => {
    if (err) throw err;
  });

  res.download(filePath);
});

// eslint-disable-next-line no-extend-native
String.prototype.hashCode = function () {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

app.post("/checkLogin", urlencodedParser, async function (req, res) {
  let uName = req.body.uName;
  let uPass = req.body.uPass;

  var result = "NO";
  let json;

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "";

  if (uName === "admin") {
    const db = mongoUtil.getDb();
    await db
      .collection("adminDetails")
      .find(
        {
          name: "admin"
        },
        {
          projection: {
            _id: 0,
            name: 0
          }
        }
      )
      .toArray(async function (err, resD) {
        if (err) throw err;

        let actualHash = resD[0]["pass"];

        if (uPass === actualHash) {
          result = "OK";
          message = message + "Admin Logged in successfully. ";
        } else {
          message =
            message + "Someone tried to login as admin. WRONG PASSWORD!. ";
        }

        json = await JSON.stringify({
          results: result,
          hash: uPass
        });

        res.end(json);
      });
  } else {
    message = message + "Someone tried to login as admin. WRONG USERNAME!. ";
    json = await JSON.stringify({
      results: result
    });

    logFile.write("\n" + logTime + " " + message);
    console.log("\n" + logTime + " " + message);
    res.end(json);
  }
});

app.post("/updatePass", urlencodedParser, async function (req, res) {
  let oldPass = req.body.oldPass;
  let newPass = req.body.newPass;

  oldPass = String(oldPass.hashCode());
  newPass = String(newPass.hashCode());

  var result = "NO";
  let json;

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "";

  const db = mongoUtil.getDb();
  await db
    .collection("adminDetails")
    .find(
      {
        name: "admin"
      },
      {
        projection: {
          _id: 0,
          name: 0
        }
      }
    )
    .toArray(async function (err, resD) {
      if (err) throw err;

      let actualHash = resD[0]["pass"];

      if (oldPass === actualHash) {
        result = "OK";
        message = message + "Admin password was updated.\n";
        await db
          .collection("adminDetails")
          .updateOne({ name: "admin" }, { $set: { pass: newPass } });
      } else {
        message =
          message +
          "Failed attempt to update admin password. Old password is wrong. ";
      }

      json = await JSON.stringify({
        results: result
      });

      logFile.write("\n" + logTime + " " + message);
      console.log("\n" + logTime + " " + message);

      res.end(json);
    });
});

app.post("/geneNames", urlencodedParser, async function (req, res) {
  const db = mongoUtil.getDb();
  let collName = req.body.collName;
  var json;
  await db
    .collection(collName)
    .find(
      {},
      { projection: { GeneName: 1, StartPosition: 1, EndPosition: 1, _id: 0 } }
    )
    .toArray(function (err, resD) {
      json = JSON.stringify({
        results: resD
      });
      res.end(json);
    });
});

app.get("/getImage", function (req, res) {
  let q = url1.parse(req.url, true);
  let qData = q.query;
  let image = qData.i;
  let org = qData.o;
  let url = "/uploads/" + org + "/" + image;
  res.sendFile(__dirname + url);
});

app.post("/updateImages", urlencodedParser, async function (req, res) {
  let newImages = req.body.images;
  let orgName = req.body.orgName;
  let toDelete = req.body.toDelete;

  let logFile = fs.WriteStream(__dirname + "/logs.txt", { flags: "a" });
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = "";

  if (toDelete !== "") {
    toDelete = toDelete.split(",");
  } else {
    toDelete = [];
  }

  if (newImages === "") {
    newImages = [];
  } else {
    newImages = newImages.split(",");
    message = message + "Added new image to " + orgName + ". ";
  }

  const db = mongoUtil.getDb();
  await db.collection("orgDetails").updateOne(
    { name: orgName },
    {
      $set: {
        images: newImages
      }
    }
  );

  toDelete.forEach(element => {
    let path = __dirname + "/uploads/" + orgName + "/" + element;
    fs.unlink(path, function (err) {
      if (err) throw err;
      message = message + "Deleted " + element + " image. ";
    });
  });

  logFile.write("\n" + logTime + " " + message);
  console.log("\n" + logTime + " " + message);

  res.end("done");
});

app.post("/logs", async function (req, res) {
  let logs = fs.readFileSync(__dirname + "/logs.txt").toString();

  let json = JSON.stringify({
    results: logs
  });

  res.end(json);
});

app.get("/downloadLog", async function (req, res) {
  const path = __dirname + "/logs.txt/";
  res.download(path, "AdminLogs.txt");
});

// 3644043

app.post("/getAFileSize", urlencodedParser, function (req, res) {
  let fileName = req.body.filename;
  let orgName = req.body.orgname;

  // let gFile = fs.readFileSync().toString();
  let gFile = fs
    .readFileSync(__dirname + "/uploads/" + orgName + "/" + fileName)
    .toString()
    .split("\n");

  gFile.splice(0, 1);
  gFile = gFile.join("\n");
  gFile = gFile.replace(/\r?\n|\r/g, "");

  let json = JSON.stringify({
    results: gFile.length
  });

  res.end(json);
});

app.post("/clearLog", function (req, res) {
  let day = new Date().toLocaleString();
  let logTime = "[" + day + "]\t";
  let message = logTime + "Previous logs were cleared!\n";

  fs.writeFile(__dirname + "/logs.txt", message, function (err) {
    if (err) {
      return console.log(err);
    }
  });
});

app.post("/sendMail", urlencodedParser, function (req, res) {
  let from = "amannverma63@gmail.com";
  let to = req.body.email;
  let subject = req.body.subject;
  let message = req.body.message;

  console.log(from, to, subject, message);

  var auth = {
    type: "oauth2",
    user: "amannverma63@gmail.com",
    clientId:
      "442908863927-iu9pe0enq7ksllecsv0k40b17aegnncf.apps.googleusercontent.com",
    clientSecret: "7jXuxETrOmIZwM7JLs315gXN",
    refreshToken:
      "1//04WPpYytV7jwJCgYIARAAGAQSNwF-L9IrY0iXzS_e9tqXBewhifFFPmQDi3ekD5WUyg-9ctCwIY32S3r5nFYHkgTUabNLZkRuUV4"
  };

  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: message,
    html: "Message from: "
  };
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: auth
  });
  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      return console.log(err);
    } else {
      console.log(JSON.stringify(res));
    }
  });

  // var smtpTransport = nodemailer.createTransport("SMTP", {
  //   service: "Gmail",
  //   auth: {
  //     XOAuth2: {
  //       user: from,
  //       clientId: "442908863927-iu9pe0enq7ksllecsv0k40b17aegnncf.apps.googleusercontent.com",
  //       clientSecret: "7jXuxETrOmIZwM7JLs315gXN",
  //       refreshToken:
  //         "1//04WPpYytV7jwJCgYIARAAGAQSNwF-L9IrY0iXzS_e9tqXBewhifFFPmQDi3ekD5WUyg-9ctCwIY32S3r5nFYHkgTUabNLZkRuUV4"
  //     }
  //   }
  // });

  // var mailOptions = {
  //   from: from,
  //   to: to,
  //   subject: subject,
  //   generateTextFromHTML: true,
  //   html: message
  // };

  // smtpTransport.sendMail(mailOptions, function(error, response) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(response);
  //   }
  //   smtpTransport.close();
  // });

  // --------------

  // var transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "amannverma63@gmail.com",
  //     pass: "AmanVerma@22"
  //   }
  // });

  // var mailOptions = {
  //   from: from,
  //   to: to,
  //   subject: subject,
  //   text: message
  // };

  // transporter.sendMail(mailOptions, function(error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });
});
