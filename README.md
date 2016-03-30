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
