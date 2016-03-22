const trest = require("../index");

//set up server
var server = new trest.Server(require("./testdata/testdata.json"), 3004);
