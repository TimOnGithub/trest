"use strict";
const request = require('supertest');
const diff = require('deep-diff').diff;
const RandExp = require('randexp');
const RegExpert = require("./RegExpert");

const defaultOptions = {
  "regExpTests": 6
};

class trestTester {

  constructor(testdata, url, options) {
    this.testdata = testdata;
    this.url = url;

    if(!options) {
      this.options = defaultOptions;
    } else {
      this.options = options;
    }

  }

  createTest(message, done) {
      return function(err, res) {

        if(err) {
            done(err);
        } else {

          let differences = diff(message.res, res.body);
          if(!differences) {
            done();
          } else {
            //lhs expected
            //rhs received
            let errorMessage = "\nsend:\n" + JSON.stringify(message.req, null, 4) +
                "\nreceived:\n" + JSON.stringify(res.body, null, 4) +
                "\nexpected:\n" + JSON.stringify(message.res, null, 4) + "\ndifferences:\n";

            for(let difference of differences) {
              let wholePath = "";
              for(let i = 0; i < difference.path.length; i++) {
                wholePath += difference.path[i];
                if(i !== difference.path.length - 1) {
                  wholePath += ".";
                }
              }
              if(difference.lhs) {
                errorMessage += "expected at: " + wholePath + ": " + difference.lhs + "\n";
                if(!difference.rhs) {
                  errorMessage += "but received nothing at: " + wholePath + "\n";
                }
              }
              if(difference.rhs) {
                errorMessage += "received at: " + wholePath + ": " + difference.rhs + "\n";
                if(!difference.lhs) {
                  errorMessage += "but expected nothing at: " + wholePath + "\n";
                }
              }
            }
            throw new Error(errorMessage);
          }

        }
    };
  }

  sendAndTestRequest(testRoute, message, thisInstance, done) {
    let method = testRoute.method.toLowerCase();
    if(method === "get") {
      // console.log("send get");
      request(thisInstance.url)
      .get(testRoute.route)
      .query(message.req)
      .end(thisInstance.createTest(message, done));
    } else {
      // console.log("send post");
      request(thisInstance.url)
        [method](testRoute.route)
        .send(message.req)
        .end(thisInstance.createTest(message, done));
    }
  }

  static genRandExp(message) {
    let copyMessage = {};
    copyMessage.res = message.res;
    copyMessage.req = {};

    for(let requestKey in message.req) {
      let currentRequest = message.req[requestKey];
      if(currentRequest.gen) {
        copyMessage.req[requestKey] = currentRequest.gen();
        // console.log("generated", message.req[requestKey]);
      } else {
        copyMessage.req[requestKey] = message.req[requestKey];
      }
    }
    return copyMessage;
  }

  static fillWithRandExp(message) {
    for(let requestKey in message.req) {
      let currentRequest = message.req[requestKey];
      //if string

      if(typeof currentRequest == "string"){
        // console.log("currentRequest", currentRequest);
        // console.log("type", typeof currentRequest);
        if(currentRequest.charAt(0) === '/' && currentRequest.charAt(currentRequest.length - 1) === '/') {
          //is regex
          // console.log("regex");
          let regexpString = currentRequest.substring(1,currentRequest.length-1);
          // console.log("regexpString", regexpString);
          let regexp = new RegExp(regexpString);
          message.req[requestKey] = new RandExp(regexp);

        } else {
          // console.log("no regex");
        }
      }

    }
  }

  executeTests() {
    var self = this;
    //for every route describe
    this.testdata.forEach(function (testRoute) {

      describe(testRoute.route + " " +testRoute.method, function(){ //jshint ignore: line

        for(let message of testRoute.messages) {
          let ignore = false;
          if(message.ignore) {
            if(message.ignore === "tester") {
              ignore = true;
            }
          }
          if(!ignore) {
            var title = message.title;
            if(!title) {
                title = "should respond as defined";
            }

            if(RegExpert.containsRegExp(message)) {
              let copyMessage;
              //get all regexp
              trestTester.fillWithRandExp(message);

              for(let i = 0; i < self.options.regExpTests; i++) {
                // console.log(message);

                copyMessage = trestTester.genRandExp(message);

                it(title + ", with " + JSON.stringify(copyMessage.req, null, 4), function(done){    //jshint ignore: line
                  self.sendAndTestRequest(testRoute, copyMessage, self, done);
                });
              }
            } else {
              it(title, function(done){    //jshint ignore: line
                self.sendAndTestRequest(testRoute, message, self, done);
              });
            }
          }
        }

      });

    });
  }
}
module.exports = trestTester;
