"use strict";
const request = require('supertest');
const equals = require("./values_equals").equals;

class trestTester {

  constructor(testdata, url) {
    this.testdata = testdata;
    this.url = url;
  }

  createTest(message, done) {
      return function(err, res) {

        if(err) {
            done(err);
        } else {
            if(equals(message.res, res.body)) {
                done();
            } else {
                throw new Error("\nsend:\n" + JSON.stringify(message.req, null, 4) +
                "\nreceived:\n" + JSON.stringify(res.body, null, 4) +
                "\nexpected:\n" + JSON.stringify(message.res, null, 4));
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

  executeTests() {
      var thisInstance = this;
    //for every route describe
    this.testdata.forEach(function (testRoute) {

      describe(testRoute.route + " " +testRoute.method, function(){ //jshint ignore: line

        testRoute.messages.forEach(function(message){
            var title = message.title;
            if(!title) {
                title = "should respond as defined";
            }
            it(title, function(done){    //jshint ignore: line
                thisInstance.sendAndTestRequest(testRoute, message, thisInstance, done);
            });

        });

      });

    });
  }
}
module.exports = trestTester;
