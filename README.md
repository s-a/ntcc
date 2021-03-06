# Namespaced Terminal Client Commands

[![NPM Version](http://img.shields.io/npm/v/ntcc.svg)](https://www.npmjs.org/package/ntcc)
[![Build Status](https://travis-ci.org/s-a/ntcc.svg)](https://travis-ci.org/s-a/ntcc)
[![Coverage Status](https://coveralls.io/repos/github/s-a/ntcc/badge.svg?branch=master)](https://coveralls.io/github/s-a/ntcc?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/aa13c5d671c34f5484564485051696a0)](https://www.codacy.com/app/stephanahlf/ntcc)
[![Dependency Status](https://david-dm.org/s-a/ntcc.svg)](https://david-dm.org/s-a/ntcc)
[![devDependency Status](https://david-dm.org/s-a/ntcc/dev-status.svg)](https://david-dm.org/s-a/ntcc#info=devDependencies)
[![NPM Downloads](https://img.shields.io/npm/dm/ntcc.svg)](https://www.npmjs.org/package/ntcc)
[![Massachusetts Institute of Technology (MIT)](https://s-a.github.io/license/img/mit.svg)](/LICENSE.md#mit)
[![Donate](http://s-a.github.io/donate/donate.svg)](http://s-a.github.io/donate/)


This module aims to provide an easy and structured way to create modular commands for Node commandline clients and load them only on demand.  
It extends a client object with an ```execute``` function which can execute modules created with a declared namespaced convention. Each namespaced module must contain a method called ```invoke```. This method runs always in context of the client object.


## Usage


### Create a command with arguments 

"test-client-commands/***clientcommand.***testcommand.open-with-arguments.js"   

```javascript
"use strict";

var Cmd = function() {
	return this;
};

Cmd.prototype.invoke = function(name1,name2,name3) {
	// runs in context of client.
	return "This testcommand is using open called from " + this.id + " (" + name1 + "," + name2 + "," + name3 + ")";
};

module.exports = Cmd;
```


### Extend a terminal client
```javascript
var NTCC = require("ntcc");
var ntcc = new NTCC();

var TestClient = function() {
	this.id = "A Testing Client";
	return this;
};
var testClient = new TestClient();

ntcc.extend({
	client: testClient,
	dir: path.join(__dirname, "..", "test-client-commands"),
	namespacePrefix: "clientcommand."
});
```



```console.log(testClient.__)``` yields:  

- execute() | Method to exec a command.
- listCommands() | Usefull to provide a commandline help.
- getCommandFilename() | returns a filename for a given command namespace.



### Invoke the test command
```javascript
it("should execute testcommand.open-with-arguments to pass custom arguments", function() {
	var args = ["arg1", "arg2", "argN"];
	var string = testClient.__.execute(["testcommand", "open-with-arguments"], args);
	string.should.equal("This testcommand is using open called from " + testClient.id + " (" + args.join(",") + ")");
});
```


For more examples see [the test-client-commands](/test-client-commands) and [the tests](test).

## A more realistic usecase

Human readable:
```javascript
testClient.__.execute(["open", 		"db", "connection"], ["connection-1"]);
testClient.__.execute(["close", 	"db", "connection"], ["connection-1"]);
testClient.__.execute(["new", 		"db", "connection"]);
testClient.__.execute(["remove", 	"db", "connection"], ["connection-1"]);
```

Or straight namespaced:
```javascript
testClient.__.execute(["connection", "db", "open"], ["connection-1"]);
testClient.__.execute(["connection", "db", "close"], ["connection-1"]);
testClient.__.execute(["connection", "db", "new"]);
testClient.__.execute(["connection", "db", "remove"], ["connection-1"]);
```

I prefer to use this module in association with [minimist](https://github.com/substack/minimist).