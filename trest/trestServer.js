"use strict";
const express = require("express");
const app = express();
const equals = require("./values_equals").equals;
const bodyParser = require('body-parser');


class trestServer {
  constructor(testdataPath, port) {

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    require(testdataPath).forEach(function (testRoute) {
      var route = testRoute.route;
      var method = testRoute.method.toLowerCase();
      var messages = testRoute.messages;
      app[method](route, function (req, res) {
        var resSend = false;

        messages.forEach(function(message){
          if(method == "get"){
            if(equals(message.req, req.query) && !resSend) {
              resSend = true;
              res.send(message.res);
            }
          } else {

            if(equals(message.req, req.body) && !resSend) {
              resSend = true;
              res.send(message.res);
            }
          }

          });
      if(!resSend) {
        res.send("given request has no response");
      }
      });
    });
    console.log("server listens on port %d", port);
    app.listen(port);
  }
}

var server = new trestServer("./testdata", 3004);
