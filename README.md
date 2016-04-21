### trest
the little helper for developing and **t**esting **rest**ful APIs

####describe your routes in json
```js
[
  {
    "route": "/hello",
    "method": "GET",
    "messages": [
      {
        "title": "should return c d when a b",
        "req": {
          "objectA": "a",
          "objectB": "b"
        },
        "res": {
          "objectC": "c",
          "objectD": "d"
        }
      },
      {
        "title": "should say hello when greeted with silence",
        "req": {},
        "res": {
          "content": "hello"
        }
      }
    ]
  }
] 
```
####Make Testsever
Use defined routes to create a testserver.
```js
const trest = require("trest");
var testData = require("./testdata/testdata.json");
var serverPort = 3004;
var server = new trest.Server(testData, serverPort); //start up server
```
The testserver will behave exactly as defined.

GET http://localhost:3004/hello -> response: {hello}

GET http://localhost:3004/hello?objectA=a&objectB=b -> response: {"objectC": "c","objectD": "d"}

Useful when first developing the frontend, or frontend and backend development is split in teams.

You want to mix trest routes with other routes? 
Don't provide the serverPort and obtain the express app() which contains the trest routes.
```js
const trest = require("trest");
var testData = require("./testdata/testdata.json");
var server = new trest.Server(testData);
var app = server.getApp();
app.listen(3004);
```

You already have some routes implemented, but still want to use trest for testing?
Disable trest routes for a specific message with "ignore":"server".
```js
"messages": [
      {
        "title": "should return c d when a b",
        "ignore": "server",
        ...
```
then get express app with trest.Server.getApp() and register your implemented routes.

####Test your API
Use defined routes to generate mocha tests for the api.
```js
//testAPI.js
const trest = require("trest");
var testData = require("./testdata/testdata.json");
var serverURL = "http://localhost:3004";
var tester = new trest.Tester(testData, serverURL);
tester.executeTests();
```
You can run the script with mocha:

In the shell *mocha testAPI.js*

When all tests pass you can be optimistic that your backend will serve the frontend what it expects.

If you want to ignore one test route message but still want to use it for the server use "ignore": "tester"

####RegExp
Trest now supports regular expressions in req, define them as Strings in your json: "/{REGEXP}/" e.g. "/ab+c+d/

The server will match the expressions and return the response if everything matches.

The tester will generate tests from the expressions. The default number of tests for messages that contain a RegExp is six. If you want to change this, instantiate the tester with an options object: 
```js
let options = {
  "regExpTests": 1
};
new trest.Tester(testdata, url, options);
```
