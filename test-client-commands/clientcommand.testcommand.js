"use strict";


var Cmd = function() {
	return this;
};


Cmd.prototype.invoke = function() {
	// runs in context of client.
	throw new Error("the testcommand command needs more arguments"); // just a helping error message for the end user
};

module.exports = Cmd;