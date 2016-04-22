"use strict";

module.exports = class Message {

  constructor(req, res, title, ignore) {
    this._initReq(req);
    this._initRes(res);
    this._initTitle(title);
    this._initIgnore(ignore);
  }

  _initReq(req) {
    if(!req) {
      this.req = {}
    } else {
      this.req = req;
    }
  }

  _initRes(res) {
    if(!res) {
      this.res = {}
    } else {
      this.res = res;
    }
  }

  _initTitle(title) {
    if(!title) {
      this.title = "";
    } else {
      this.title = title;
    }
  }

  _initIgnore(ignore) {
    if(!ignore) {
      this.ignore = "";
    } else {
      this.ignore = ignore;
    }
  }

  setRequest(req) {
    this.req = req;
  }

  setResponse(res) {
    this.res = res;
  }

  setTitle(title) {
    this.title = title;
  }

  ignoreTester() {
    this.ignore = "tester";
  }

  ignoreServer() {
    this.ignore = "server";
  }

  stopIgnore() {
    this.ignore = "";
  }
}
