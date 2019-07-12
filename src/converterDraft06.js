'use strict';

const debug = require('debug')('xsd2jsonschema:ConverterDraft06')

const ConverterDraft04 = require('./converterDraft04');
const XsdFile = require('./xmlschema/xsdFileXmlDom');

class ConverterDraft06 extends ConverterDraft04 {
	/**
	 * Constructs an instance of ConverterDraft06.
	 * @constructor
	 */
	constructor(options) {
		super(options);
		// The working schema is initilized as needed through XML Handlers
	}

	maxExclusive(node, jsonSchema, xsd) {
		var val = XsdFile.getNumberValueAttr(node);

		this.workingJsonSchema.exlusiveMaximum = val;
		return true;
	}

	minExclusive(node, jsonSchema, xsd) {
		var val = XsdFile.getNumberValueAttr(node);

		this.workingJsonSchema.exclusiveMinimum = val;
		return true;
	}
}

module.exports = ConverterDraft06;