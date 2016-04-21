"use strict";

module.exports = class RegExpert {
  static containsRegExp(message) {
    let containsRegExp = false;
    for(let requestKey in message.req) {
      let currentRequest = message.req[requestKey];
      if(typeof currentRequest == "string"){
        // console.log("currentRequest", currentRequest);
        // console.log("type", typeof currentRequest);
        if(currentRequest.charAt(0) === '/' && currentRequest.charAt(currentRequest.length - 1) === '/') {
          containsRegExp = true;
        }
      }
    }
    return containsRegExp;
  }
}
