"use strict";
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const RegExpert = require("./RegExpert");
const diff = require('deep-diff').diff;



class trestServer {
  constructor(testdata, port) {
    this.app = express();
    this.app.use( bodyParser.json() );       // to support JSON-encoded bodies
    this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));
    this.app.use(cors());
    this.setUpRoutes(testdata);
    if(port) {
      console.log("server listens on port %d", port);
      this.app.listen(port);
    }
  }
  setUpRoutes(testdata){
    let self = this;
    testdata.forEach(function (testRoute) {
      var route = testRoute.route;
      var method = testRoute.method.toLowerCase();
      var messages = testRoute.messages;
      self.app[method](route, function (req, res) {
        var resSend = false;

        messages.forEach(function(message){
          // console.log("checking message", message);
          let ignore = false;
          if(message.ignore) {
            if(message.ignore === "server") {
              ignore = true;
            }
          }
          // console.log("ignore", ignore);
          if(!ignore){
            let request;
            let differencesResolved = true;

            if(method == "get"){
              request = req.query;
            } else {
              request = req.body;
            }

            let differences = diff(request, message.req);
            if(differences) {
              for(let difference of differences) {
              if(!difference.rhs || !difference.lhs || !difference.rhs.length || !difference.rhs.charAt){
                // console.log("rhs or lhs not defined");
                differencesResolved = false;
              } else {
                if(difference.rhs.charAt(0) === '/' && difference.rhs.charAt(difference.rhs.length - 1) === '/') {
                  let regexpString = difference.rhs.substring(1,difference.rhs.length-1);
                  let regexp = new RegExp(regexpString);
                  if(difference.lhs.match(regexp)) {
                    // resolved stays true
                    // console.log(difference.lhs + " matches " + difference.rhs);
                    // console.log("with: ", difference.lhs.match(regexp));
                  } else {
                    // console.log(difference.lhs + " not matches " + difference.rhs);
                    // console.log("with: ", difference.lhs.match(regexp));
                    differencesResolved = false;
                  }
                } else {
                  differencesResolved = false;
                }
              }
            }
          }
          // console.log("differences", differences);
          if(!differences || (differences && differencesResolved)) {
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
  }






  listen(port) {
    this.app.listen(port);
  }
  getApp(){
    return this.app;
  }
}

module.exports = trestServer;
