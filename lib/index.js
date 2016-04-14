"use strict"

var glob  = require("glob");
var path  = require("path");

var NamespacedTerminalClientCommand = function(){
	return this;
};


NamespacedTerminalClientCommand.prototype.validate = function() {
	if (!this.config){
		throw new Error("no configution object given");
	}

	if (!this.config.client){
		throw new Error("no client object given");
	}

	if (!this.config.namespacePrefix){
		throw new Error("no namespacePrefix given");
	}

	if (!this.config.dir){
		throw new Error("no directory for clientcommands given");
	}
};

NamespacedTerminalClientCommand.prototype.initialize = function() {
	if (!this.config.client.__){
		this.config.client.__ = {};
	}

	this.config.client.__.listCommands = this.listCommands.bind(this);
	this.config.client.__.getCommandFilename = this.getCommandFilename.bind(this);
};

NamespacedTerminalClientCommand.prototype.extend = function(config) {
	this.config = config;
	this.validate();
	this.initialize();
	this.config.client.__.execute = this.execute.bind(this);
};

NamespacedTerminalClientCommand.prototype.getCommandFilename = function(commandNamespace /* Array */) {
	return path.join(this.config.dir, this.config.namespacePrefix + commandNamespace.join(".") + ".js");
};


NamespacedTerminalClientCommand.prototype.listCommands = function() {
	var result = [];
	var filemask = path.join(this.config.dir, this.config.namespacePrefix + "*.js");
	var files = glob.sync( filemask );
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var name = path.basename(file).replace(this.config.namespacePrefix, "").replace(".js","");
		result.push({name:name, filename:file});
	}
	return result;
};

NamespacedTerminalClientCommand.prototype.validateCommandModule = function(moduleFunction) {
	if (typeof moduleFunction.invoke !== "function"){
		throw new Error("command module does not have an invoke function");
	}
};

NamespacedTerminalClientCommand.prototype.loadCommandModule = function(filename) {
	var Mod = require(filename);
	var mod = new Mod();
	this.validateCommandModule(mod);
	return mod;
};

NamespacedTerminalClientCommand.prototype.execute = function(commandNamespace /* Array of namespace */, args) {
	var filename = this.getCommandFilename(commandNamespace);
	// load on demand
	var mod = this.loadCommandModule(filename);

	// invoke
	return mod.invoke.bind(this.config.client).apply(null, args);
};

module.exports = NamespacedTerminalClientCommand;