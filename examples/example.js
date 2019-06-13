/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

process.env['DEBUG'] = 'xsd2jsonschema:XmlUsageVisitorSum';

const fs = require('fs');

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const XmlUsageVisitor = require('xsd2jsonschema').XmlUsageVisitor;
const XmlUsageVisitorSum = require('xsd2jsonschema').XmlUsageVisitorSum;
const Ajv = require('ajv');

const ajv = new Ajv({
	allErrors: true,
	verbose: false
});

const action = process.argv[2];

// Options for example
const options = {
	xsdBaseUri: 'http://something.important.com'
};

const xs2js = new Xsd2JsonSchema(options);

const baseTypesSchemaFilename = 'BaseTypes.xsd';
const exampleTypesSchemaFilename = 'ExampleTypes.xsd';
const xsdSchemas = {};
xsdSchemas[baseTypesSchemaFilename] = loadFile(baseTypesSchemaFilename);
xsdSchemas[exampleTypesSchemaFilename] = loadFile(exampleTypesSchemaFilename);

let jsonSchemas = xs2js.processAllSchemas({
	schemas: xsdSchemas
});
dumpSchemas(jsonSchemas);

} else if (action === "xml-usage") {
	const visitor = new XmlUsageVisitor();
	xs2js.processAllSchemas({
		schemas: xsdSchemas,
		visitor: visitor
	});
	visitor.dump();
} else if (action === "xml-usage-sum") {
	const visitor = new XmlUsageVisitorSum();
	xs2js.processAllSchemas({
		schemas: xsdSchemas,
		visitor: visitor
	});
	visitor.dump();
} else if (action === "test-custom-type") {
	var jsonSchemas = xs2js.processAllSchemas({
		schemas: xsdSchemas
	});
	var apt = jsonSchemas["ExampleTypes_2016-01-01.xsd"].getSubSchemas()["www.xsd2jsonschema.org"].getSubSchemas()["example"].getSubSchemas()["PersonInfoType"];
	var log = JSON.stringify(apt.getJsonSchema(), null, 2);
	console.log(log);

	var namespaceManager = xs2js.getNamespaceManager();
	var apt2 = namespaceManager.getNamespace("/www.xsd2jsonschema.org/example").types["PersonInfoType"];
	var log2 = JSON.stringify(apt2.getJsonSchema(), null, 2);
	console.log(log2);

}

function dumpSchemas(jsonSchemas) {
	console.log('\n*** JSON Schemas ***');
	Object.keys(jsonSchemas).forEach(function (uri, index, array) {
		console.log(index + ') ' + uri);
		console.log(JSON.stringify(jsonSchemas[uri].getJsonSchema(), null, 2));
	}, this);
}

function loadFile(path) {
	const buf = fs.readFileSync(path);
	const xsd = buf.toString();
	return xsd;
}
