                                                                                                                                                                         
```
Y88b   d88P              888  .d8888b. 888888                             .d8888b.           888                                      
 Y88b d88P               888 d88P  Y88b  "88b                            d88P  Y88b          888                                      
  Y88o88P                888        888   888                            Y88b.               888                                      
   Y888P   .d8888b   .d88888      .d88P   888 .d8888b   .d88b.  88888b.   "Y888b.    .d8888b 88888b.   .d88b.  88888b.d88b.   8888b.  
   d888b   88K      d88" 888  .od888P"    888 88K      d88""88b 888 "88b     "Y88b. d88P"    888 "88b d8P  Y8b 888 "888 "88b     "88b 
  d88888b  "Y8888b. 888  888 d88P"        888 "Y8888b. 888  888 888  888       "888 888      888  888 88888888 888  888  888 .d888888 
 d88P Y88b      X88 Y88b 888 888"         88P      X88 Y88..88P 888  888 Y88b  d88P Y88b.    888  888 Y8b.     888  888  888 888  888 
d88P   Y88b 88888P'  "Y88888 888888888    888  88888P'  "Y88P"  888  888  "Y8888P"   "Y8888P 888  888  "Y8888  888  888  888 "Y888888 
                                        .d88P                                                                                         
                                      .d88P"                                                                                          
                                     888P"                                                                                            
```

#Xsd2JsonSchema

A tool to convert XML Schema to JSON Schema.

## Why


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
var bmsConversion = new Xsd2JsonSchema(null, baseDir, filenames, options);
var visitor = null;

if (action === "convert") {
	visitor = new DefaultConversionVisitor();
	bmsConversion.processAllSchemas(new DefaultConversionVisitor());
	bmsConversion.dump();
} else if (action === "xml-usage") {
	visitor = new XmlUsageVisitor();
	bmsConversion.processAllSchemas(visitor);
	visitor.log();
} else if (action === "xml-usage-sum") {
	visitor = new XmlUsageVisitorSum();
	bmsConversion.processAllSchemas(visitor);
	visitor.log();
} else if (action === "test-custom-type") {
	visitor = new DefaultConversionVisitor();
	bmsConversion.processAllSchemas(new DefaultConversionVisitor());
	var jsonSchemas = bmsConversion.getJsonSchemas();
	var apt = jsonSchemas["ExampleTypes.xsd"].getSubSchemas()["www.xsd2jsonschema.org"].getSubSchemas()["example"].getSubSchemas()["PersonInfoType"];
	var log = JSON.stringify(apt.getJsonSchema(), null, 2);
	console.log(log);

	var customTypes = bmsConversion.getCustomTypes();
	var apt2 = customTypes.getNamespace("/www.xsd2jsonschema.org/example").customTypes["PersonInfoType"];
	var log2 = JSON.stringify(apt2.getJsonSchema(), null, 2);
	console.log(log2);

} else if (action === "dump-schemas") {
	visitor = new DefaultConversionVisitor();
	bmsConversion.processAllSchemas(new DefaultConversionVisitor());
	bmsConversion.dumpSchemas();
}
```
Command Line  
```node example/example.js convert example/ ExampleTypes.xsd```

## Developing


## Tools
Created with [Visual Studio Code](https://github.com/Microsoft/vscode), [site](http://code.visualstudio.com))   

## Libraries:  
1. [libxmljs](https://www.npmjs.com/package/libxmljs) libxml bindings for v8 javascript engine

## References
1. [Definitive XML Schema, 2nd Edition](https://www.amazon.com/Definitive-XML-Schema-Priscilla-Walmsley/dp/0132886723), [site](https://www.pearsonhighered.com/program/Walmsley-Definitive-XML-Schema-2nd-Edition/PGM282380.html)

