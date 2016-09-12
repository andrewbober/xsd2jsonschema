/**
 *  JSON Schema parsing states
 * 
 *  This module is used as a singleton to identify key elements being parsed.  The 
 *  goal is to identify elements with SimpleTypes vs SimpleTypes for future use.
 */

"use strict";

var elConst = require('./xsdElements');

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
	enterState: function (state) {
		states.push(state);
	},
	exitState: function () {
		return states.pop();
	},
	pushSchema: function(schema) {
		states[states.length-1].workingJsonSchema = schema;
	},
	getCurrentState: function() {
		return getCurrentState();
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
		console.log("\nCurrent parsing states: " + filename);
		for (let i = 0; i < states.length; i++) {
			var schema = states[i].workingJsonSchema == undefined ? "": " [" + states[i].workingJsonSchema + "]"
			console.log(i + ") " + states[i].name + schema);
		}
	}
}
