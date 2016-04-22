"use strict";
const trest = require("../../index");

let trestData = [];
let loginRoute = new trest.Route("/hello3", "get");

let validRequest = {
  "username": "pete",
  "pw": "1234"
};

let invalidRequest = {
  "username": "pete",
  "pw": "4321"
};

let validResponse = {
  "success": true,
  "content": {}
};

let invalidResponse = {
  "success": false,
  "content": "Username and password do not match"
}

let validLoginMessage = new trest.Message(validRequest, validResponse);
validLoginMessage.setTitle("valid login example");
loginRoute.addMessage(validLoginMessage);

let invalidLoginMessage = new trest.Message(invalidRequest, invalidResponse, "invalid login")
loginRoute.addMessage(invalidLoginMessage);

trestData.push(loginRoute);
module.exports = trestData;
