'use strict';

const debug = require('debug')('xsd2jsonschema:OptionalChoiceFunctionalTest');
const BaseFunctionalTest = require('./baseFunctionalTest');

class OptionalChoiceFunctionalTest extends BaseFunctionalTest {
	constructor() {
		super({
			xsdPath: 'test/xmlschemas/functional/',
			xsdFilename: 'optionalChoice.xsd',
			testInstances: [
				{
					"expectedToValidate": true,
					"testData": {
						optionalChoiceEverythingIsOptionalType: {
						}
					}
				},
				{
					"expectedToValidate": true,
					"testData": {
						optionalChoiceEverythingIsOptionalType: {
							UknownValue: 10
						}
					}
				},
				{
					"expectedToValidate": true,
					"testData": {
						optionalChoiceAllOptionsRequiredType: {
							Option3: true
						}
					}
				},
				{
					"expectedToValidate": false,
					"testData": {
						optionalChoiceAllOptionsRequiredType: {
							Option3: true,
							Option2: "Option2",
							Option1: "Option1"
						}
					}
				},
				{
					"expectedToValidate": true,
					"testData": {
						optionalChoiceOneRequiredOptionType: {
							Option2: true
						}
					}
				},
				{
					"expectedToValidate": true,
					"testData": {
						optionalChoiceOneRequiredOptionAndOneOptionalType: {
							Option3: true
						}
					}
				},
				{
					"expectedToValidate": true,
					"testData": {
						optionalChoiceTwoRequiredOptionAndOneOptionalType: {
							Option4: true
						}
					}
				},
			]
		})
	}
}

module.exports = OptionalChoiceFunctionalTest;
