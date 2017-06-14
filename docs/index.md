# **Xsd2JsonSchema Documentation**

## Table of Contents

1. [Introduction](#Introduction)
2. [Instatllation](#Installation)
3. [Conversion Overview](#Conversion-Overview)
4. [XML Schema Support Overview](#XML-Schema-Support-Overview)
5. [XML Schema Support Reference](#XML-Schema-Support-Reference)
6. [Example Application](#Example-ApplicationXML-Schema-Support-Reference)

## **Introduction**
*Xsd2JsonSchema* is a library to convert XML Schema to JSON Schema.  It is written JavaScript for Node.js and tested on MacOS, Linux, and Windows 10.  All platforms supported by NodeJS should work as long as they support [libxml](http://xmlsoft.org), which is the basis of [libxmljs](https://github.com/libxmljs/libxmljs).  *Xsd2JsonSchema* utilizes the native Node module *libxmljs* to parse xml files. 

## **Installation**
1. Install Node.js for your platform.  See [https://nodejs.org](https://www.nodejs.org) for instruction on downloading and installting on your platform.

2. Clone the git repository to your workstation.  One way to do this is to use the git command line tools.  Please note you will need to have [git](https://git-scm.com) installed.

``` git clone https://github.com/andrewbober/xsd2jsonschema.git ```

3. (Optional - Windows only when using [libxmljs](https://www.npmjs.com/package/libxmljs)) Install all the required Windows tools and configurations [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) using the command below from an elevated PowerShell or CMD.exe (run as Administrator).

``` npm install --global --production windows-build-tools ```

4. After cloning completes run the following command from the project directory.

``` npm install ```

5. Add this line to the "dependancies" section of the package.json file to include faster native xml processing support provided by [libxmljs](https://www.npmjs.com/package/libxmljs).   **Please note**: you will need to have a C/C++ compiler installed to build *libxmljs*, which is a native Node module.  On Windows you may need to install [node-gyp](https://github.com/nodejs/node-gyp#installation) separately as described in [step #3](#3).

``` "libxmljs-dom": "0.0.8" ```

6. Run the included example from the project directory to confirm *Xsd2JsonSchema* is working.

``` npm run example ```

## **Conversion Overview**
1. Components Global and Local
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
2. Elements and Attributes

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
3. Types Simple and Complex
    
    Cover both restriction and extension here.  
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
4. Namespaces
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

5. Schema Composition

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
6. Annotions
    
    Annotation are not supported at this time.
7. Named groups

    Named groups are not supported at this time.
8. Identity contraints

    Identity constraints are not supported at this time.
9. Substitution groups

    Substitution groups are not supported at this time.
10. Redefinition and overriding

    Redefinition and overriding are not supported at this time.
11. Assertions

    Assertions are not supported at this time.

## XML Schema Support Overview
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## XML Schema Support Reference
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Example Application
```javascript
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
```

Command line to run the example.  **NOTE:** This is the command used to run the example in step 6 of the [Instatllation](#Installation) above.

```node example/example.js convert example/ ExampleTypes.xsd```

## Version History

* v0.0.2
  * Updated code to the ECMAScript 2015 (ES6) standard
  * Added support for [xmldom](https://www.npmjs.com/package/xmldom) for a 100% JavaScript solution (retained the ability to use [libxmljs](https://www.npmjs.com/package/libxmljs) for faster native xml parsing)
  * Added Jasmine unit tests
  * Added Coveralls.io support
  * Created initial documentation

* v0.0.3
  * Refactored xmlschema and jsonschema specific code into corresponding sub folders
  * Heavy work on documentaiion
  * Several variable name refactorings for readability
  * Added faux interfaces to assist customizations