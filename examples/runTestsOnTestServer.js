const trest = require("../index");
var tester = new trest.Tester(require("./testdata/testdata2"), "http://localhost:3004");
tester.executeTests();

// var oneFailTester = new trest.Tester(require("./testdata/testdata0.json"), "http://localhost:3004");
// oneFailTester.executeTests();
