'use strict';

const debug = require('debug')('xsd2jsonschema:ConverterDraft07')

const ConverterDraft06 = require('./converterDraft06');

class ConverterDraft07 extends ConverterDraft06 {
	/**
	 * Constructs an instance of ConverterDraft07.
	 * @constructor
	 */
	constructor(options) {
		super(options);
		// The working schema is initilized as needed through XML Handlers
	}
}

module.exports = ConverterDraft07;