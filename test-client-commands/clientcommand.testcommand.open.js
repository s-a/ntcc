"use strict"


var Cmd = function Cmd() {
	return this;
};


Cmd.prototype.invoke = function() {
	// runs in context of client.
	return "This testcommand is using open called from " + this.id;
};

module.exports = Cmd;