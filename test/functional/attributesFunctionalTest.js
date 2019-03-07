'use strict';

const BaseFunctionalTest = require('./baseFunctionalTest');

class AttributeFunctionalTest extends BaseFunctionalTest {
	constructor() {
		super({
			xsdPath: 'test/xmlschemas/functional/',
			xsdFilename: 'attributes.xsd',
			testInstances: [
				{
					"expectedToValidate": true,
					"testData": {
						AttributeTest: {
							'@localAttrInteger': 1,
							'@localAttrRequired': true,
							'@globalAttrBoolean': true,
							'@globalAttrUntyped': '2017-01-01',
							'@localAtrribute': 0,
							'@localAttrBoolean': true
						}
					}
				},
				{
					"expectedToValidate": true,
					"testData": {
						AttributeTest: {
							'@localAttrRequired': true,
							'@globalAttrUntyped': '2017-01-01'
						}
					}
				},
				{
					"expectedToValidate": false,
					"testData": {
						AttributeTest: {
							'@localAttrRequired': true
						}
					}
				}
			]
		})
	}
}

module.exports = AttributeFunctionalTest;
