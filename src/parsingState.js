'use strict';

const debug = require('debug')('xsd2jsonschema:ParsingState');

const XsdElements = require('./xmlschema/xsdElements');
const XsdFile = require('./xmlschema/xsdFileXmlDom');
const XsdNodeTypes = require('./xmlschema/xsdNodeTypes');


const states_NAME = Symbol();
const node_NAME = Symbol();
const workingJsonSchema_NAME = Symbol();
const attribute_NAME = Symbol();

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

class State {
	constructor(values) {
			if (values == undefined) {
			throw new Error('values is required for a new State');
		}
		if (values.node == undefined) {
			throw new Error('node is required for a new State');
		}
		this.node = values.node;
		this.workingJsonSchema = values.workingJsonSchema;
		this.attribute = values.attribute;
	}

	get node() {
		return this[node_NAME];
	}
	set node(newNode) {
		this[node_NAME] = newNode;
	}
	get workingJsonSchema() {
		return this[workingJsonSchema_NAME];
	}
	set workingJsonSchema(newWorkingJsonSchema) {
		this[workingJsonSchema_NAME] = newWorkingJsonSchema;
	}
	get attribute() {
		return this[attribute_NAME];
	}
	set attribute(newAttribute) {
		this[attribute_NAME] = newAttribute;
	}
	get name() {
		return XsdFile.getNodeName(this.node);
	}

	get typeName() {
		return XsdFile.getNameAttrValue(this.node);
	}
}

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
		if (debug.enabled === true) {
			debug('Current parsing state within [' + filename + ']:');
			const maxLen = 0
			for (let i = 0; i < this.states.length; i++) {
				var schema = this.states[i].workingJsonSchema == undefined ? '': ' ' + this.states[i].workingJsonSchema
				schema = schema.length > maxLen ? schema.substring(0, maxLen) + '\n...TRUNCATED to ' + maxLen + ' characters' : schema
				debug(i + ') ' + XsdFile.nodeQuickDumpStr(this.states[i].node) + ' ' + schema);
			}
			debug('________________________________________________________________________________________');
		}
	}
}

module.exports.ParsingState = ParsingState;
module.exports.State = State;
