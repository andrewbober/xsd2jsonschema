/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

var Xsd2JsonSchema = require('xsd2JsonSchema').Xsd2JsonSchema;
var DefaultConversionVisitor = require('xsd2JsonSchema').DefaultConversionVisitor;
var XmlUsageVisitor = require('xsd2JsonSchema').XmlUsageVisitor;
var XmlUsageVisitorSum = require('xsd2JsonSchema').XmlUsageVisitorSum;

var filenames = [];
for (var i = 4; i < process.argv.length; i++) {
	filenames.push(process.argv[i]);
}
var action = process.argv[2];
var baseDir = process.argv[3];
var options = {
	mask: /(_CodeExt)?_\d{4}-\d{2}-\d{2}/,
	outputDir: "example/generated_jsonschema",
	resolveURI: "example/generated_jsonschema"
};
var converter = new Xsd2JsonSchema(baseDir, filenames, options);
var visitor = null;

if (action === "convert") {
	converter.processAllSchemas(new DefaultConversionVisitor());
	converter.writeFiles();
	converter.dump();
} else if (action === "xml-usage") {
	visitor = new XmlUsageVisitor();
	converter.processAllSchemas(visitor);
	visitor.dump();
} else if (action === "xml-usage-sum") {
	visitor = new XmlUsageVisitorSum();
	converter.processAllSchemas(visitor);
	visitor.dump();
} else if (action === "test-custom-type") {
	converter.processAllSchemas(new DefaultConversionVisitor());
	var jsonSchemas = converter.getJsonSchemas();
	var apt = jsonSchemas["ExampleTypes.xsd"].getSubSchemas()["www.xsd2jsonschema.org"].getSubSchemas()["example"].getSubSchemas()["PersonInfoType"];
	var log = JSON.stringify(apt.getJsonSchema(), null, 2);
	console.log(log);

	var customTypes = converter.getCustomTypes();
	var apt2 = customTypes.getNamespace("/www.xsd2jsonschema.org/example").customTypes["PersonInfoType"];
	var log2 = JSON.stringify(apt2.getJsonSchema(), null, 2);
	console.log(log2);

} else if (action === "dump-schemas") {
	converter.processAllSchemas(new DefaultConversionVisitor());
	converter.dumpSchemas();
}
