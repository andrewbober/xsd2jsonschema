"use strict";

var XsdElements = require("./xmlschema/xsdElements");

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

/**
 * This module is a singleton used to track the current depth of parsing an XML Schema file.  The current state is defined as the
 * name of the parent of current element in the XML Schema.  For example, when processing an *&lt;include&gt;* element the current
 * state is "schema" because the parent of *&lt;include&gt;* is *&lt;schema&gt;*.  The top of the XML Schema file is the *&lt;schema&gt;*
 * element.  When processing the *&lt;schema&gt;* element there is no current state because it has not been established.
 * 
 * The current state of traversing the XML Schema tree is used to help facilitate conversion to JSON Schema.  For example, it is
 * beneficial to know what the parent element (or state) is when converting an *&lt;attribute&gt;* elememnt because annonymous attributes
 * need to be handled differenlty than named attributes.
 * 
 * It is an error to get the current state before it has been established by fully processing the <schema> element.
 * 
 * @module ParsingState
 * @see {@link BaseConverter#attribute|BaseConverter.attribute()}
 */

module.exports = {
	/**
	 * Pushes a new state onto the stack.
	 * @param {String} state - The name of the current elment in the XML Schema file.  This method is called before processing the current element.
	 * 
	 * @see {@link DepthFirstTraversal#walk|DepthFirstTraversal.walk()}
	 */
	enterState: function (state) {
		states.push(state);
	},

	/**
	 * Pops the most recent state off the stack.
	 * 
	 * @returns {String} - The name of the elment in the XML Schema file that just finished conversion.
	 * @see {@link DepthFirstTraversal#walk|DepthFirstTraversal.walk()}
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

	/**
	 * Returns the most state most recently entered.
	 * 
	 * @returns {String} - The name of the elment in the XML Schema file that is currently being converted.ust finished conversion.  @see 
	 * @see {@link DepthFirstTraversal#walk|DepthFirstTraversal.walk()}

	 */
	getCurrentState: function() {
		return getCurrentState();
	},

	/**
	 * @returns {Boolean} - True if the current state is "attribute".
	 */
	inAttribute: function() {
		return getCurrentState().name === XsdElements.ATTRIBUTE;
	},
	/**
	 * @returns {Boolean} - True if the current state is "element".
	 */
	inElement: function () {
		return getCurrentState().name === XsdElements.ELEMENT;
	},
	/**
	 * @returns {Boolean} - True if the current state is "documentation".
	 */
	inDocumentation: function () {
		return getCurrentState().name === XsdElements.DOCUMENTATION;
	},
	/**
	 * @returns {Boolean} - True if the current state is "appinfo".
	 */
	inAppInfo: function() {
		return getCurrentState().name === XsdElements.APPINFO;
	},
	/**
	 * @returns {Boolean} - True if the current state is "choice".
	 */
	inChoice: function() {
		return getCurrentState().name === XsdElements.CHOICE;
	},
	/**
	 * @returns {Boolean} - True if the parent of the current state is "schema".
	 */
	isTopLevelEntity: function () {
		if (states.length == 2) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * Dumps the stack of states to the console for error reporting or debugging purposes.
	 */
	dumpStates: function (filename) {
		console.log("________________________________________________________________________________________");
		console.log("\nCurrent parsing state within [" + filename + "]:");
		for (let i = 0; i < states.length; i++) {
			var schema = states[i].workingJsonSchema == undefined ? "": " [" + states[i].workingJsonSchema + "]"
			console.log(i + ") " + states[i].name + schema);
		}
	}
}
