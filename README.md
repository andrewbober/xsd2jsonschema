
# Xsd2JsonSchema 
[![Codeship Status for andrewbober/xsd2jsonschema](https://app.codeship.com/projects/ee9a49e0-46b3-0133-28c9-569fce9c4062/status?branch=master)](https://app.codeship.com/projects/104942)
[![Coverage Status](https://coveralls.io/repos/github/andrewbober/xsd2jsonschema/badge.svg?branch=master)](https://coveralls.io/github/andrewbober/xsd2jsonschema?branch=master)
[![GitHub version](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema.png)](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema)

A library to convert XML Schema to JSON Schema.  Written in JavaScript for Node.js.

## Why
I created this tool to assist anyone interested in validating JSON instances against a JSON Schema that was originally written in XML Schema.

## XML Schema 1.0 Support Summary
All entities are supported.
Substitution Groups are

<<<<<<< HEAD
## XML Schema 1.1 Support Summary

## XML Schema Support Details
[Xsd2JsonSchmea XML Schema Support Status](https://drive.google.com/open?id=1AMeTHNNvwuI06mjkAQi7mt8KmU7qUSFI7x-o_kF1Ko8)

## Documentation
TBD
=======
## Usage

```javascript
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

```
Command Line  
```node example/example.js convert example/ ExampleTypes.xsd```
>>>>>>> 2ea670b284a9f1b9aea37bf9cc0fc75429b8cdb7

## Developing
Please see the wiki for an overview of the code and outstanding development needs.  [Developing](https://github.com/andrewbober/xsd2jsonschema/wiki/Developing)

## Third-Party Libraries used by this module:
* [xmldom](https://www.npmjs.com/package/xmldom) - A pure JavaScript library for xml parsing.
* [libxmljs](https://www.npmjs.com/package/libxmljs) (optional) - A native library for faster xml parsing.  This requires a C/C++ compiler to build.

## Third-Party Development Libraries used by this module:
* [require-self](https://www.npmjs.com/package/require-self) - This support library allows the example.js script and functional tests to utilize the library as intended.
* [Jasmine](https://github.com/jasmine/jasmine) - JavaScript Testing Framework
* [Istanbul](https://github.com/gotwarlost/istanbul) - JavaScript code coverage tool
* [node-coveralls](https://github.com/nickmerwin/node-coveralls) - Automated updates to [Coveralls.io](http://coveralls.io)
* [XML Schema Test Suite](https://www.w3.org/XML/2004/xml-schema-test-suite) - The official World Wide Web Consortium (WC3) XML Schema Test Suite

## Tools
* Created with [Visual Studio Code](https://github.com/Microsoft/vscode), [site](http://code.visualstudio.com)
* Continuous Integration by [Codeship](https://codeship.com)
* Test coverage history & statistics by [Coveralls.io](http://coveralls.io)

## References
1. [Definitive XML Schema, 2nd Edition](https://www.amazon.com/Definitive-XML-Schema-Priscilla-Walmsley/dp/0132886723), [site](https://www.pearsonhighered.com/program/Walmsley-Definitive-XML-Schema-2nd-Edition/PGM282380.html)
2. [XML Schema](https://www.w3.org/XML/Schema)
3. [JSON Schema](http://www.json-schema.org)

## Alternatives
* [xsd2json](https://www.npmjs.com/package/xsd2json)
* [xsd2json2](https://www.npmjs.com/package/xsd2json2)
* [Jsonix Schema Complier](https://github.com/highsource/jsonix-schema-compiler)
* [XMLSpy](https://www.altova.com/xmlspy/json-schema-editor.html)