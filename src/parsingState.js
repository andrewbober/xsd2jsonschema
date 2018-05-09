'use strict';

const debug = require('debug')('xsd2jsonschema:ParsingState');

const XsdElements = require('./xmlschema/xsdElements');


const states_NAME = Symbol();

/**
 * This class is used to track the current depth of parsing an XML Schema file.  The current state is defined as the
 * name of the parent of current element in the XML Schema.  For example, when processing an *&lt;include&gt;* element the current
 * state is 'schema' because the parent of *&lt;include&gt;* is *&lt;schema&gt;*.  The top of the XML Schema file is the *&lt;schema&gt;*
 * element.  When processing the *&lt;schema&gt;* element there is no current state because it has not been established.
 * 
 * The current state of traversing the XML Schema tree is used to help facilitate conversion to JSON Schema.  For example, it is
 * beneficial to know what the parent element (or state) is when converting an *&lt;attribute&gt;* elememnt because annonymous attributes
 * need to be handled differenlty than named attributes.
 * 
 * It is an error to get the current state before it has been established by fully processing the <schema> element.
 * 
 * Example state
 *   var state = {
 *      name : '',
 *      workingJsonSchema : {},
 * 		attribute: 'value'
 *   }
 *
 * @module ParsingState
 * @see {@link BaseConverter#attribute|BaseConverter.attribute()}
 */

class ParsingState {
	constructor() {
		// A stack of states
		this.states = [];
	}

	// getters/setters
	get states() {
		return this[states_NAME]
	}
	set states(newStates) {
		this[states_NAME] = newStates;
	}

	/**
	 * Pushes a new state onto the stack.
	 * @param {String} state - The name of the current elment in the XML Schema file.  This method is called before processing the current element.
	 * 
	 * @see {@link DepthFirstTraversal#walk|DepthFirstTraversal.walk()}
	 */
	enterState(state) {
		this.states.push(state);
	}

	/**
	 * Pops the most recent state off the stack.
	 * 
	 * @returns {String} - The name of the elment in the XML Schema file that just finished conversion.
	 * @see {@link DepthFirstTraversal#walk|DepthFirstTraversal.walk()}
	 */
	exitState() {
		return this.states.pop();
	}

	/*
	 * Use pushSchema() to store a schema you would like to restore after processing a 
	 * given element.  This schema will be restored as the 'workingJsonSchema' upon exiting
	 * a state.  See baseConversionVisitor.js.
	 */
	pushSchema(schema) {
		this.states[this.states.length-1].workingJsonSchema = schema;
	}

	/**
	 * Returns the state most recently entered.
	 * 
	 * @returns {String} - The name of the elment in the XML Schema file that is currently being converted.
	 * @see {@link DepthFirstTraversal#walk|DepthFirstTraversal.walk()}

	 */
	getCurrentState() {
		if (this.states.length > 1) {
			return this.states[this.states.length-2];
		} else if (this.states.length === 1) {
			throw new Error('Not \'in\' a state yet.  We are \'on\' state=\'' + this.states[0].name + '\'!');
		} else {
			throw new Error('There are no states!');
		}
	}

	/**
	 * @returns {Boolean} - True if the current state is 'attribute'.
	 */
	inAttribute() {
		return this.getCurrentState().name === XsdElements.ATTRIBUTE;
	}
	/**
	 * @returns {Boolean} - True if the current state is 'element'.
	 */
	inElement() {
		return this.getCurrentState().name === XsdElements.ELEMENT;
	}
	/**
	 * @returns {Boolean} - True if the current state is 'documentation'.
	 */
	inDocumentation() {
		return this.getCurrentState().name === XsdElements.DOCUMENTATION;
	}
	/**
	 * @returns {Boolean} - True if the current state is 'appinfo'.
	 */
	inAppInfo() {
		return this.getCurrentState().name === XsdElements.APPINFO;
	}
	/**
	 * @returns {Boolean} - True if the current state is 'choice'.
	 */
	inChoice() {
		return this.getCurrentState().name === XsdElements.CHOICE;
	}
	/**
	 * @returns {Boolean} - True if the parent of the current state is 'schema'.
	 */
	isTopLevelEntity() {
		if (this.states.length == 2) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * Dumps the stack of states to the console for error reporting or debugging purposes.
	 */
	dumpStates(filename) {
		debug('________________________________________________________________________________________');
		debug('\nCurrent parsing state within [' + filename + ']:');
		for (let i = 0; i < this.states.length; i++) {
			var schema = this.states[i].workingJsonSchema == undefined ? '': ' [' + this.states[i].workingJsonSchema + ']'
			debug(i + ') ' + this.states[i].name + schema);
		}
	}
}

module.exports = ParsingState;