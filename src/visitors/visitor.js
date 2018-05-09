'use strict'

const debug = require('debug')('xsd2jsonschema:Visitor');

const Processor = require('./../processor');
const XsdFile = require('./../xmlschema/xsdFileXmlDom');


const processor_NAME = Symbol();

/**
 * Class representing a visitor.  Vistors are utilized by {@link DepthFirstTraversal} to process each node within an XML 
 * Schema file.  This base implmention simply calls the processor member's {@link Processor#process|Processor.process()}
 * method to facilitate conversion of the XML node being visited from XMLSchema to JSON Schema.
 * 
 * @module Visitor
 * @see {@link BaseConversionVisitor} 
 * @see {@link XmlUsageVisitor} 
 * @see {@link XmlUsageVisitorSum} 
 * @see {@link Processor} 
 */

class Visitor {
	/**
	 * Constructs an instance of Visitor.
	 * 
	 * @constructor
	 * @param {Processor} processor - {@link Processor} or subclass of {@link Processor}.
	 */
	constructor(processor) {
		if (processor != undefined) {
			this.processor = processor;
		} else {
			this.processor = new Processor();
		}
	}

	// Getters/Setters

	get processor() {
		return this[processor_NAME];
	}
	set processor(newProcessor) {
		this[processor_NAME] = newProcessor;
	}

	/**
	 * This method is called for each node in the XML Schema file being processed.  It involks {@link BaseConverter#process|BaseConverter.process()} 
	 * to effect the conversion of the current element in {@link XsdFile|xsd}.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being converted.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - False if an error occurs to cancel traversal of {@link XsdFile|xsd}.  Otherwise, the return value of {@link BaseConverter#process|BaseConverter.process()}
	 */
	visit(node, jsonSchema, xsd) {
		try {
			return this.processor.process(node, jsonSchema, xsd);
		} catch (err) {
			debug(err.stack);
			this.processor.parsingState.dumpStates(xsd.baseFilename);
			XsdFile.dumpNode(node);
			//return false;
			throw err;
		}
	}
}

module.exports = Visitor;