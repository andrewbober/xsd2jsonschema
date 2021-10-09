'use strict';

const XsdFile = require('./xmlschema/xsdFileXmlDom');

const okayToContinue_NAME = Symbol();
const NOT_PROCESSED_NODES = ['appinfo'];

/**
 * Class represtending a depth first traversal algorithm.  This class is used as part of a visitor pattern 
 * to traverse the nodes within an XML Schema visiting each to facitiate conversion to JSON Schema.
 */

 class DepthFirstTraversal {
	/**
	 * Constructs an instance of DepthFirstTraversal.
	 * @constructor
	 */
	constructor() {
		this.okayToContinue = true;
	}

    // Getters/Setters

	get okayToContinue() {
		return this[okayToContinue_NAME];
	}
	
	set okayToContinue(NewOkayToContinue) {
		this[okayToContinue_NAME] = NewOkayToContinue;
	}
	
	/**
	 * This function implements a recursive algorithm to traverse a tree of xml schema nodes in a depth first manner.  Each
	 * node is visited and a customizalbe {@link BaseConversionVisitor|visiter} is applied.  The visiter can abandon the traversal at any time by 
	 * returning false from the {@link BaseConversionVisitor#visit|visit()} method.
	 * 
	 * @param {BaseConversionVisitor} visitor - {@link BaseConversionVisitor} or a subclass of {@link BaseConversionVisitor}
	 * @param {Node} node - The XML 'schema' element within {@link XsdFile|xsd} to be used as the start of conversion.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being converted.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @see {@link BaseConversionVisitor#visit|BaseConversionVisitor.visit()}
	 */
	walk(visitor, node, jsonSchema, xsd) {
		// walk the tree
		if (node !== null) {
			visitor.enterState(node, jsonSchema, xsd);
			this.okayToContinue = visitor.visit(node, jsonSchema, xsd);
			if (this.okayToContinue) {
				var children = NOT_PROCESSED_NODES.includes(node.localName) ?
					[] :
					XsdFile.getChildNodes(node);
				if (children !== null && children.length > 0) {
					for(let child of children) {
						this.walk(visitor, child, jsonSchema, xsd);
						if(!this.okayToContinue) {
							break;
						}
					};
				}
			}
			visitor.exitState(node, jsonSchema, xsd);
		}

	}

	/**
	 * Begins a traversal of {@link XsdFile|xsd} by first calling visitor's {@link BaseConversionVisitor#onBegin|onBegin()} method.  The traversal can be abandoned by 
	 * returning false from {@link BaseConversionVisitor#onBegin|onBegin()}. After the traversal is complete the vistor's {@link BaseConversionVisitor#onEnd|OnEnd()} 
	 * method is called.
	 * 
	 * @param {BaseConversionVisitor} visitor - {@link BaseConversionVisitor} or a subclass of {@link BaseConversionVisitor}
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current XML Schema file {@link XsdFile|xsd} to be converted.
	 * @param {XsdFile} xsd - The XML schema file to be converted.
	 * 
	 * @see {@link BaseConversionVisitor#onBegin|BaseConversionVisitor.onBegin()}
	 * @see {@link BaseConversionVisitor#onEnd|BaseConversionVisitor.onEnd()}
	 */
	traverse(visitor, jsonSchema, xsd) {
		if (visitor.onBegin(jsonSchema, xsd)) {
			this.walk(visitor, xsd.schemaElement, jsonSchema, xsd);
		}
		return visitor.onEnd(jsonSchema, xsd);
	}

}

module.exports = DepthFirstTraversal;