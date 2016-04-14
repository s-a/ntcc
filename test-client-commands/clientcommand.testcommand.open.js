"use strict";


var Cmd = function() {
	return this;
};


Cmd.prototype.invoke = function() {
	// runs in context of client.
	return "This testcommand is using open called from " + this.id;
};

module.exports = Cmd;