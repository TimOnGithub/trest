const trest = require("../index");
const express = require("express");

//set up server
var trestServer = new trest.Server(require("./testdata/testdata2"));
var app = trestServer.getApp();
app.get("/tu", function(req, res) {
  res.send("tutu");
})
app.listen(3004);
