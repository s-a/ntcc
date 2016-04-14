"use strict"


var Cmd = function Cmd() {
	return this;
};


Cmd.prototype.invoke = function(name1,name2,name3) {
	// runs in context of client.
	return "This testcommand is using open called from " + this.id + " (" + name1 + "," + name2 + "," + name3 + ")";
};

module.exports = Cmd;