/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

var Xsd2JsonSchema = require('../src/xsd2JsonSchema');
var XmlUsageVisitor = require('../src/visitors/xmlUsageVisitor');
var XmlUsageVisitorSum = require('../src/visitors/xmlUsageVisitorSum');
var DefaultConversionVisitor = require('../src/visitors/defaultConversionVisitor');

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
var converter = new Xsd2JsonSchema(null, baseDir, filenames, options);
var visitor = null;

if (action === "convert") {
	visitor = new DefaultConversionVisitor();
	converter.processAllSchemas(new DefaultConversionVisitor());
	converter.dump();
} else if (action === "xml-usage") {
	visitor = new XmlUsageVisitor();
	converter.processAllSchemas(visitor);
	visitor.log();
} else if (action === "xml-usage-sum") {
	visitor = new XmlUsageVisitorSum();
	converter.processAllSchemas(visitor);
	visitor.log();
} else if (action === "test-custom-type") {
	visitor = new DefaultConversionVisitor();
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
	visitor = new DefaultConversionVisitor();
	converter.processAllSchemas(new DefaultConversionVisitor());
	converter.dumpSchemas();
}


