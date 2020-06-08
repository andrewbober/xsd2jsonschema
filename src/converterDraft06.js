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
	}

	// Override maxExclusive with new draft-v6 behavior
	maxExclusive(node, jsonSchema, xsd) {
		const val = XsdFile.getValueAttrAsNumber(node);
		// TODO: id, fixed

		this.workingJsonSchema.exclusiveMaximum = val;
		return true;
	}

	// Override minExclusive with new draft-v6 behavior
	minExclusive(node, jsonSchema, xsd) {
		const val = XsdFile.getValueAttrAsNumber(node);
		// TODO: id, fixed

		this.workingJsonSchema.exclusiveMinimum = val;
		return true;
	}

}

module.exports = ConverterDraft06;