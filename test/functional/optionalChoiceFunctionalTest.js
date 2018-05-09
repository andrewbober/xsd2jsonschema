'use strict';

const debug = require('debug')('xsd2jsonschema:OptionalChoiceFunctionalTest');
const BaseFunctionalTest = require('./baseFunctionalTest');

class OptionalChoiceFunctionalTest extends BaseFunctionalTest {
	constructor() {
		super({
			xsdPath: 'xmlSchemas/functional/',
			xsdFilename: 'optionalChoice.xsd',
			testInstances: [
				{
					"expectedToValidate": true,
					"testData": {
					}
				}
			]
		})
	}
}

module.exports = OptionalChoiceFunctionalTest;
