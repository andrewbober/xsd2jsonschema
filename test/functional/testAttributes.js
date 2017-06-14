/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

var Xsd2JsonSchema = require('Xsd2JsonSchema').Xsd2JsonSchema;

// Options for tests
var options = {
	outputDir: "test/generated_jsonschema",
	baseId: "http://www.xsd2jsonschema.org/schema/",
	xsdBaseDir: "test/"
};

var converter = new Xsd2JsonSchema(options);
converter.processAllSchemas({
	xsdFilenames: [
		"data/attribute.xsd"
	]
});
converter.writeFiles();
converter.dump();
converter.dumpSchemas();
