"use strict";

const Processor = require('xsd2jsonschema').Processor;

class XsdTestSuiteProcessor extends Processor {

		testSuite(node, jsonSchema, xsd) {
			return true;
		}
	
		testSetRef(node, jsonSchema, xsd) {
			return true;
		}

		testSet(node, jsonSchema, xsd) {
			return true;
		}

		uniqueGroupName(node, jsonSchema, xsd) {
			return true;
		}

		testGroup(node, jsonSchema, xsd) {
			return true;
		}

		schemaTest(node, jsonSchema, xsd) {
			return true;
		}

		instanceTest(node, jsonSchema, xsd) {
			return true;
		}

		schemaDocument(node, jsonSchema, xsd) {
			return true;
		}

		instanceDocument(node, jsonSchema, xsd) {
			return true;
		}

		current(node, jsonSchema, xsd) {
			return true;
		}

		prior(node, jsonSchema, xsd) {
			return true;
		}

		statusEntry(node, jsonSchema, xsd) {
			return true;
		}

		status(node, jsonSchema, xsd) {
			return true;
		}

		bugURI(node, jsonSchema, xsd) {
			return true;
		}

		expected(node, jsonSchema, xsd) {
			return true;
		}

		validityOutcome(node, jsonSchema, xsd) {
			return true;
		}

		testSuiteResults(node, jsonSchema, xsd) {
			return true;
		}

		testResult(node, jsonSchema, xsd) {
			return true;
		}

		ref(node, jsonSchema, xsd) {
			return true;
		}

		documentationReference(node, jsonSchema, xsd) {
			return true;
		}

		annotation(node, jsonSchema, xsd) {
			return true;
		}

		appinfo(node, jsonSchema, xsd) {
			return true;
		}

		documentation(node, jsonSchema, xsd) {
			return true;
		}
}

module.exports = XsdTestSuiteProcessor;
