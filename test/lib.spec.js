"use strict";

var path = require("path");
require("should");
var NTCC;
try {
	NTCC = require("./../lib-cov/index.js");
} catch(e){
	NTCC = require("./../lib/index.js");
}
var ntcc = new NTCC();
var ntcc2 = new NTCC();

var TestClient = function testClient() {
	this.id = "A Testing Client";
	return this;
};
var testClient = new TestClient();

ntcc.extend({
	client: testClient,
	dir: path.join(__dirname, "..", "test-client-commands"),
	namespacePrefix: "clientcommand."
});


describe("initialize", function(){

	it("should throw no configution object given", function() {
		(function(){
			//var testClient2 = new TestClient();
			ntcc2.extend();
		}).should.throw("no configution object given");
	});

	it("should throw no client object given", function() {
		(function(){
			ntcc2.extend({});
		}).should.throw("no client object given");
	});

	it("should throw no namespacePrefix given", function() {
		(function(){
			ntcc2.extend({
				client: testClient
			});
		}).should.throw("no namespacePrefix given");
	});

	it("should throw no directory for clientcommands given", function() {
		(function(){
			ntcc2.extend({
				client: testClient,
				namespacePrefix: "clientcommand."
			});
		}).should.throw("no directory for clientcommands given");
	});
});

describe("extend", function(){

	it("should have extended test client", function() {
		/* jshint ignore:start */
		// Code here will be ignored by JSHint.
		testClient.__.should.exist;
		testClient.__.execute.should.exist;
		testClient.__.listCommands.should.exist;
		testClient.__.getCommandFilename.should.exist;
		/* jshint ignore:end */
	});

	it("should list client commands", function() {
		var commands = testClient.__.listCommands();
		commands.length.should.equal(4);
	});

	it("should execute testcommand", function() {
		(function(){
			testClient.__.execute(["testcommand"]);
		}).should.throw("the testcommand command needs more arguments");
	});

	it("should execute testcommand.open", function() {
		var string = testClient.__.execute(["testcommand", "open"]);
		string.should.equal("This testcommand is using open called from " + testClient.id);
	});

	it("should execute testcommand.open-with-arguments to pass custom arguments", function() {
		var args = ["arg1", "arg2", "argN"];
		var string = testClient.__.execute(["testcommand", "open-with-arguments"], args);
		string.should.equal("This testcommand is using open called from " + testClient.id + " (" + args.join(",") + ")");
	});

	it("should throw cannot find module", function() {
		var command = ["testcommand", "non-existing-command"];
		var moduleFilename = testClient.__.getCommandFilename(command);
		(function(){
			testClient.__.execute(command);
		}).should.throw("Cannot find module \'" + moduleFilename + "\'");
	});

	it("should throw command module does not have an invoke function", function() {
		var command = ["invalid-command"];
		(function(){
			testClient.__.execute(command);
		}).should.throw("command module does not have an invoke function");
	});

});