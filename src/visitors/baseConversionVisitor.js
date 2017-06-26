"use strict";

const parsingState = require("./../parsingState");
const Visitor = require("./visitor");
const XsdFile = require("./../xmlschema/xsdFileXmlDom");
const Processor = require("./../processor");

const processor_NAME = Symbol();

/**
 * Class representing a visitor.  Vistors are utilized by {@link DepthFirstTraversal} to process each node within an XML 
 * Schema file.  This base implmention simply calls the processor member's process() method to facilitate conversion
 * from XMLSchema to JSON Schema.  It also adds error handling.
 */
class BaseConversionVisitor extends Visitor {

	/**
	 * Constructs an instance of BaseConversionVisiter.
	 * @constructor
	 * @param {Processor} processor - {@link BaseConverter} or a subclass of {@link Processor}
	 */
	constructor(processor) {
		super();
		if (processor != undefined) {
			this.processor = processor;
		} else {
			this.processor = new Processor();
		}
	}

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
			console.log(err.stack);
			parsingState.dumpStates(xsd.baseFilename);
			XsdFile.dumpNode(node);
			return false; //throw err;
		}
	}

	/**
	 * Utilizes {@link module:ParsingState|ParsingState} to push the current elment name (or state) to a stack.  When convertion begins for a given element this method is called.  When conversion ends for the same element the {@link BaseConversionVisitor#exitState|exitState()} method is called.   The stack of element names (or states) represents current depth of the conversion process within {@link XsdFile|xsd}.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being converted.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 */
	enterState(node, jsonSchema, xsd) {
		var state = {
			name: XsdFile.getNodeName(node),
			workingJsonSchema: undefined
		}
		parsingState.enterState(state);
	}

	/**
	 * Utilizes {@link module:ParsingState|ParsingState} to pop and element (or state) from a stack of element nodes.  The stack 
	 * of element names (or states) represents current depth of the conversion process within {@link XsdFile|xsd}.
	 */
	exitState() {
		var state = parsingState.exitState();
		if (state.workingJsonSchema !== undefined) {
			this.processor.workingJsonSchema = state.workingJsonSchema;
		}
	}

	/**
	 * This method is called before conversion of {@link XsdFile|xsd} is started.  Subclasss can override this method to implement class 
	 * specific pre-processing behavior.  The default implementation initializes a namespace for the XML Schema file's targetNamespace
	 * and returns true to allow conversion to start.
	 * 
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema file that will represent converted XML Schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file about to be processed.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	onBegin(jsonSchema, xsd) {
		/*
				console.log("\n\n****************************************************************************************************");
				console.log("Converting " + xsd.getBaseFilename());
				console.log("****************************************************************************************************\n");
		*/
		this.processor.initializeNamespace(xsd.targetNamespace);
		return true;
	}

	/**
	 * This method is called after conversion of {@link XsdFile|xsd} has completed.  Subclasss can override this method to implement 
	 * class specific post-processing behavior.  The default implementation calls {@link BaseConverter#processSpecialCases|BaseConverter.processSpecialCases()}.
	 * 
	 * @param {JsonSchemaFile} jsonSchema - The resulting JSON Schema file from the conversion.
	 * @param {XsdFile} xsd - The XML Schema file {@link XsdFile|xsd} that was just converted.
	 */
	onEnd(jsonSchema, xsd) {
		this.processor.processSpecialCases();
	}

}

module.exports = BaseConversionVisitor;