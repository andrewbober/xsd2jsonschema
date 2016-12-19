/**
 *  JSON Schema parsing states
 * 
 *  This module is used as a singleton to identify key elements being parsed.  The 
 *  goal is to identify elements with SimpleTypes vs SimpleTypes for future use.
 */

"use strict";

var elConst = require("./xsdElements");

// A stack of states
var states = [];

/* Example state
var state = {
	name : "",
	workingJsonSchema : {}
}
*/

function iterateStateReverse(tagName) {
	for (let i = states.length - 2; i >= 0; i--) {
		if (states[i].name === tagName) {
			return true;
		}
	}
	return false;
}

/*
 * A local version of the exposed getCurrentState function.
 */
function getCurrentState() {
	if (states.length > 1) {
		return states[states.length-2];
	} else if (states.length === 1) {
		throw new Error("Not 'in' a state yet.  We are 'on' state='" + states[0] + "'!");
	} else {
		throw new Error("There are no states!");
	}
}

module.exports = {
	/*
	 * Pushes a new state onto the stack.
	 */
	enterState: function (state) {
		states.push(state);
	},

	/*
	 * Pops the most recent state off the stack.
	 */
	exitState: function () {
		return states.pop();
	},

	/*
	 * Use pushSchema() to store a schema you would like to restore after processing a 
	 * given element.  This schema will be restored as the "workingJsonSchema" upon exiting
	 * a state.  See baseConversionVisitor.js.
	 */
	pushSchema: function(schema) {
		states[states.length-1].workingJsonSchema = schema;
	},

	/*
	 * Returns the most state most recently entered.
	 */
	getCurrentState: function() {
		return getCurrentState();
	},

	inAttribute: function() {
		return getCurrentState().name === elConst.attribute;
	},
	inElement: function () {
		return getCurrentState().name === elConst.element;
	},
	inDocumentation: function () {
		return getCurrentState().name === elConst.documentation;
	},
	inAppInfo: function() {
		return getCurrentState().name === elConst.appinfo;
	},
	inChoice: function() {
		return getCurrentState().name === elConst.choice;
	},
	isTopLevelEntity: function () {
		if (states.length == 2) {
			return true;
		} else {
			return false;
		}
	},
	dumpStates: function (filename) {
		console.log("________________________________________________________________________________________");
		console.log("\nCurrent parsing state within [" + filename + "]:");
		for (let i = 0; i < states.length; i++) {
			var schema = states[i].workingJsonSchema == undefined ? "": " [" + states[i].workingJsonSchema + "]"
			console.log(i + ") " + states[i].name + schema);
		}
	}
}
