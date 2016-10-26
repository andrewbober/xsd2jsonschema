/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

var Xsd2JsonSchema = require('../src/xsd2JsonSchema');
var DefaultConversionVisitor = require('../src/visitors/defaultConversionVisitor');

var filenames = [ "attribute.xsd" ];
var baseDir = "test";
var options = {
	outputDir: "test/generated_jsonschema",
	resolveURI: "test/generated_jsonschema"
};
var converter = new Xsd2JsonSchema(null, baseDir, filenames, options);
converter.processAllSchemas(new DefaultConversionVisitor());
converter.dump();
converter.dumpSchemas();