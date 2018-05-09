'use strict';

const debug = require('debug')('xsd2jsonschema:Processor');
const XsdNodeTypes = require('./xmlschema/xsdNodeTypes');
const XsdFile = require('./xmlschema/xsdFileXmlDom');
const ParsingState = require('./parsingState');


const parsingState_NAME = Symbol();
const workingJsonSchema_NAME = Symbol();

/**
 * Class representing an XML processor. XML Processof XML Handler methods for converting XML Schema elements to JSON
 * Schema.  XML handler methods are methods used to convert an element of the corresponding name an equiviant JSON Schema 
 * representation.  An XML Handler method has a common footprint shown by the process() 
 * {@link Processor#process|Processor.process()} method and a name that corresponds to one of the XML Schema element names
 * found in {@link module:XsdElements}.  For example, the choice handler method:\
 * <pre><code>choice(node, jsonSchema, xsd)</code></pre>
 */

 class Processor {
	/**
	 * Constructs an instance of Processor.
	 * @constructor
	 */
	constructor() {
		this.parsingState = new ParsingState();
	}

	// getters/setters

	get parsingState() {
		return this[parsingState_NAME];
	}
	set parsingState(newParsingState) {
		this[parsingState_NAME] = newParsingState;
	}

	get workingJsonSchema() {
		return this[workingJsonSchema_NAME];
	}
	set workingJsonSchema(newWorkingSchema) {
		this[workingJsonSchema_NAME] = newWorkingSchema;
	}

	/**
	 * This method is called for each node in the XML Schema file being processed.  It first processes an ID attribute if present and 
	 * then calls the appropriate XML Handler method.  Subclasses should override this method.
     * 
	 * @param {Node} node - the current element in xsd being processed.
	 * @param {JsonSchemaFile} jsonSchema - the JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being processed.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {Boolean} - handler methods can return false to cancel traversal of {@link XsdFile|xsd}.  
     * 
     * @see {@link BaseConverter#process|BaseConverter.process()}
	 */
	process(node, jsonSchema, xsd) {
		if(debug.enabled === true && node.nodeType) { //} != XsdNodeTypes.TEXT_NODE) {
			this.parsingState.dumpStates(xsd.uri);
			debug('***********************************************************************************\n' + 
			XsdNodeTypes.getTypeName(node.nodeType) + '\n' + node + '\nJSONSCHEMA=\n' + jsonSchema);
		}
		return true;
	}

	/**
	 * This method is called after processing is complete to perform processing that couldn't be handled by
	 * the XML Handler methods.  Subclasses should override this method.
     * 
     * @see {@link BaseConverter#processSpecialCases|BaseConverter.processSpecialCases()}
	 */
	processSpecialCases() {
		//throw new Error('Please implement this method.  Processor.processSpecialCases()');
	}
}

module.exports = Processor;
