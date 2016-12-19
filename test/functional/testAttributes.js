/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

var Xsd2JsonSchema = require('xsd2JsonSchema').Xsd2JsonSchema;
var DefaultConversionVisitor = require('xsd2JsonSchema').DefaultConversionVisitor;

var filenames = [ "data/attribute.xsd" ];
var baseDir = "test";
var options = {
	outputDir: "test/generated_jsonschema",
	resolveURI: "test/generated_jsonschema"
};
var converter = new Xsd2JsonSchema(baseDir, filenames, options);
converter.processAllSchemas(new DefaultConversionVisitor());
converter.writeFiles();
converter.dump();
converter.dumpSchemas();
