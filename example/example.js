/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

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

/*
// Options for example
const options = {
	mask: /_\d{4}-\d{2}-\d{2}/,
	outputDir: "example/generated_jsonschema",
	baseId: "http://www.xsd2jsonschema.org/schema/",
	xsdBaseDir: "example/",
};

const xsdFilenames = [
		"ExampleTypes_2016-01-01.xsd"
	];
*/

// Options for BMS
const options = {
        mask: /(_CodeExt|_ClassicCode)?_2017R1_V5.5.0/,
        outputDir: "example/generated_jsonschema",
        baseId: 'http://www.cieca.com/schema/',
        xsdBaseDir: '/Users/andrewbober/BMS/5.5.0/BMSCodeExtSchemas/',
}

const xsdFilenames = [
		"BMSRoot_CodeExt_2017R1_V5.5.0.xsd"
	];

const converter = new Xsd2JsonSchema(options);

if (action === "convert") {
	converter.processAllSchemas( {
		xsdFilenames: xsdFilenames
	});
	converter.writeFiles();
	converter.dump();
} else if (action === "xml-usage") {
	const visitor = new XmlUsageVisitor();
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames,
		visitor: visitor
	});
	visitor.dump();
} else if (action === "xml-usage-sum") {
	const visitor = new XmlUsageVisitorSum();
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames,
		visitor: visitor
	});
	visitor.dump();
} else if (action === "test-custom-type") {
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames
	});
	var jsonSchemas = converter.getJsonSchemas();
	var apt = jsonSchemas["ExampleTypes.xsd"].getSubSchemas()["www.xsd2jsonschema.org"].getSubSchemas()["example"].getSubSchemas()["PersonInfoType"];
	var log = JSON.stringify(apt.getJsonSchema(), null, 2);
	console.log(log);

	var customTypes = converter.getCustomTypes();
	var apt2 = customTypes.getNamespace("/www.xsd2jsonschema.org/example").customTypes["PersonInfoType"];
	var log2 = JSON.stringify(apt2.getJsonSchema(), null, 2);
	console.log(log2);
} else if (action === "dump-schemas") {
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames
	});
	converter.dumpSchemas();
} else if (action === "validate") {
	const exampleTypesSchema = loadFile("example/generated_jsonschema/ExampleTypes.json");
	const baseTypesSchema = loadFile("example/generated_jsonschema/BaseTypes.json");
	ajv.addSchema([
		baseTypesSchema,
		exampleTypesSchema
	]);
	const exampleDataFilenames = [
		"example/ExampleDataPersonInfo.json",
		"example/ExampleDataPersonName.json"
	];
	const validate = ajv.getSchema("http://www.xsd2jsonschema.org/schema/ExampleTypes.json");
	exampleDataFilenames.forEach(function (filename, index, array) {
		var exampleData = loadFile(filename);
		const valid = validate(exampleData);
		if (valid) {
			console.log(filename + " = VALID!");
		} else {
			console.log(filename + " = INVALID\n" + JSON.stringify(validate.errors, null, "\t") + "\n");
		}
	})
}

function loadFile(path) {
	const buf = fs.readFileSync(path);
	const json = JSON.parse(buf);
	return json;
}
