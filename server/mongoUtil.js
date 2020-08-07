require('dotenv').config();

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://" + process.env.CREDS + "@gene.amsa8.mongodb.net/minorProject?retryWrites=true&w=majority";

var _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        _db = client.db("minorProject");
        return callback(err);
      }
    );
  },

  getDb: function () {
    return _db;
  }
};
