"use strict";

var BaseConvertionVisitor = require("./baseConversionVisitor");

var uris_NAME = Symbol();


/**
 * Class representing a custom visitor.  This visitor lists the XML Schema elments used by the provided 
 * {@link XsdFile|XML Schema} files and displays element counts by file.
 */
class XmlUsageVisitor extends BaseConvertionVisitor {
	/**
	 * Constructs an instance of XmlUsageVisitor without a converter because all processing will be done here in the
	 * visitor.  Notice {@link BaseConversionVisitor#visit|BaseConversionVisitor.visit()} is overridden.
	 * 
	 * @constructor
	 */
	constructor() {
		super(undefined);
		this.uris = {};
	}

	// Getters/Setters
	get uris() {
		return this[uris_NAME];
	}

	set uris(newUris) {
		this[uris_NAME] = newUris;
	}

	addSchema(uri) {
		if (this.uris[uri] === undefined) {
			this.uris[uri] = { tagCounts: {} }
		}
	}

	addTag(uri, xmlTag) {
		if (this.uris[uri].tagCounts[xmlTag] === undefined) {
			this.uris[uri].tagCounts[xmlTag] = 1;
		} else {
			this.uris[uri].tagCounts[xmlTag] += 1;
		}
	}

	/**
	 * Overrides {@link BaseConversionVisitor#visit|BaseConversionVisitor.visit()} to do the work of calculating node counts by file.
	 * 
	 * @param {Node} node - the current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - the JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being converted.
	 * @param {XsdFile} xsd - the XML schema file currently being converted.
	 * 
	 * @returns {Boolean} True
	 */
	visit(node, jsonSchema, xsd) {
		var uri = xsd.uri;
		this.addSchema(uri);
		this.addTag(uri, node.name());
		return true;
	}

	/**
	 * Overrides {@link BaseConversionVisitor#onBegin|BaseConversionVisitor.onBegin()} to ensure each file is only processed once. The
	 * counts would be off is one common file is included by several files and all files were processed.
	 * 
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema file that will represent converted XML Schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file about to be processed.
	 * 
	 * @returns {Boolean} True If xsd has not already been processed.  False otherwise.
	 */
	onBegin(jsonSchema, xsd) {
		if (this.uris[xsd.uri] === undefined) {
			return true;
		} else {
			return false;
		}
	}

	dump() {
		Object.keys(this.uris).sort().forEach(function (uri, index, array) {
			console.log(uri);
			console.log("-----------------");
			Object.keys(this.uris[uri].tagCounts).sort().forEach(function (xmlTag, index, array) {
				console.log(xmlTag + " = " + this.uris[uri].tagCounts[xmlTag]);
			}, this)
			console.log();
		}, this);
	}

}

module.exports = XmlUsageVisitor;