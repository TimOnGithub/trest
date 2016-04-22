"use strict";
module.exports = class Route {
  constructor(path, method, messages) {
    this._initPath(path);
    this._initMethod(method);
    this._initMessages(messages);
  }

  _initPath(path) {
    if(!path) {
      this.route = "";
    } else {
      this.route = path;
    }
  }

  _initMethod(method) {
    if(!method) {
      this.method = "";
    } else {
      this.method = method;
    }
  }

  _initMessages(messages) {
    if(!messages) {
      this.messages = [];
    } else {
      this.messages = messages;
    }
  }

  setPath(path) {
    this.route = path;
  }

  setMethod(method) {
    this.method = method;
  }

  setMessages(messages) {
    this.messages = messages;
  }

  addMessage(message) {
    this.messages.push(message);
  }
}
