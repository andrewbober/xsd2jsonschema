/**
 *  TBD
 */

"use strict";

var BaseConverter = require('./../baseConverter');
var parsingState = require("./../parsingState");

function DefaultConversionVisitor() {

	var converter = new BaseConverter(this);

	this.visit = function visit(node, jsonSchema, xsd) {
		try {
			return converter[node.name()](node, jsonSchema, xsd);
		} catch (err) {
			parsingState.dumpStates(xsd.getBaseFilename());
			converter.dumpNode(node);
			console.log(err.stack);
			return false; //throw err;
		}
	};

	this.enterState = function enterState(node, jsonSchema, xsd) {
		var state = {
			name : node.name(),
			workingJsonSchema : undefined
		}
		parsingState.enterState(state);
	};

	this.exitState = function exitState() {
		var state = parsingState.exitState();
		if (state.workingJsonSchema !== undefined) {
			converter.setWorkingJsonSchema(state.workingJsonSchema);
		}
	};

	this.onBegin = function onBegin(jsonSchema, xsd) {
		/*
				console.log("\n\n****************************************************************************************************");
				console.log("Converting " + xsd.getBaseFilename());
				console.log("****************************************************************************************************\n");
		*/
		return true;
	};

	this.onEnd = function onEnd(jsonSchema, xsd) {
	};

}

module.exports = DefaultConversionVisitor;