'use strict';

const debug = require('debug')('xsd2jsonschema:Processor');

const XsdFile = require('./xmlschema/xsdFileXmlDom');
const XsdNodeTypes = require('./xmlschema/xsdNodeTypes');
const ParsingState = require('./parsingState').ParsingState;


const parsingState_NAME = Symbol();
const workingJsonSchema_NAME = Symbol();
const includeTextAndCommentNodes_NAME = Symbol();

/**
 * Class representing an XML processor containing XML Handler methods for converting XML Schema into JSON
 * Schema.  XML handler methods convert XML elements into the equiviant JSON Schema representation.
 * An XML Handler method has a common footprint shown by the process() 
 * {@link Processor#process|Processor.process()} method and a name that corresponds to one of the XML Schema element names
 * found in {@link module:XsdElements}.  For example, the choice handler method:\
 * <pre><code>choice(node, jsonSchema, xsd)</code></pre>
 * 
 * This base class provides
 */

 class Processor {
	/**
	 * Constructs an instance of Processor.
	 * @constructor
	 */
	constructor(options) {
		this.parsingState = new ParsingState();
		if (options != undefined) {
			this.includeTextAndCommentNodes = options.includeTextAndCommentNodes != undefined ? options.includeTextAndCommentNodes : false;
		} else {
			this.includeTextAndCommentNodes = false;
		}
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

	get includeTextAndCommentNodes() {
		return this[includeTextAndCommentNodes_NAME];
	}
	set includeTextAndCommentNodes(newIncludeTextAndCommentNodes) {
		this[includeTextAndCommentNodes_NAME] = newIncludeTextAndCommentNodes;
	}

	/**
	 * This method is called for each node in the XML Schema file being processed.  It provides detailed logging if enabled.  Subclasses
	 * should override this method and call it only for logging purposes.
     * 
	 * @param {Node} node - the current element in xsd being processed.
	 * @param {JsonSchemaFile} jsonSchema - the JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being processed.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {Boolean} - handler methods can return false to cancel traversal of {@link XsdFile|xsd}.  
     * 
     * @see {@link ConverterDraft04#process|ConverterDraft04.process()}
	 */
	process(node, jsonSchema, xsd) {
		// parsingState.dumpStates() will check for debug.enabled so it's okay to call unchecked.  This allows ParsingState logging to be enabled separately from Processor.
		if ((node.nodeType != XsdNodeTypes.TEXT_NODE && node.nodeType != XsdNodeTypes.COMMENT_NODE) || this.includeTextAndCommentNodes === true) {
			this.parsingState.dumpStates(xsd.uri);
			XsdFile.dumpNode(node);
			if(debug.enabled === true) {
				debug('***********************************************************************************\n' + 
				'XSD_Node_TO_APPLY= ' + node + '\nJSON_SCHEMA_WITH_XSD_NODE_APPLIED=\n' + jsonSchema);
			}
		}
		return true;
	}

	/**
	 * This method is called after processing is complete to perform processing that couldn't be handled by
	 * the XML Handler methods.  Subclasses should override this method as needed.
     * 
     * @see {@link ConverterDraft04#processSpecialCases|ConverterDraft04.processSpecialCases()}
	 */
	processSpecialCases() {
		debug('Processing special cases')
		//throw new Error('Please implement this method.  Processor.processSpecialCases()');
	}
}

module.exports = Processor;
