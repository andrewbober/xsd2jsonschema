
# Xsd2JsonSchema 
[![Codeship Status for andrewbober/xsd2jsonschema](https://app.codeship.com/projects/ee9a49e0-46b3-0133-28c9-569fce9c4062/status?branch=master)](https://app.codeship.com/projects/104942)
[![Coverage Status](https://coveralls.io/repos/github/andrewbober/xsd2jsonschema/badge.svg?branch=master)](https://coveralls.io/github/andrewbober/xsd2jsonschema?branch=master)
[![GitHub version](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema.png)](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema)

A pure Javascript library for converting XML Schema to JSON Schema.  Xsd2JsonSchema was designed to be fast and extendable.  The classes in Xsd2JsonSchema can be readily subclassed to create the customized conversion you need for your project.

## Why
I created this tool to assist anyone interested in validating JSON instances against a JSON Schema that was originally written in XML Schema. Other conversion tools I found where either written in a language I'm not familiar with such as Prolog or were not full featured.  I wanted a solution
that had the following features:
1. A pure JavaScript implementation.
2. Support multiple namespaces - XML Schemas can utilize any number of namespaces and Xsd2JsonSchema leverages JSON Schema's sub-schema feature to provide this support.
2. Support imported files - This required for #1.  Many XML Schemas are combined from disperate sources using different namespaces.
3. Support included files - Many XML Schemas are broken up into multiple files to promote reuse.
4. Support xml attributes - Yes.
5. Support the original file organization in the resulting schema conversion - If the author of an XML Schema organized it into three files I wanted the JSON Schema conversion to follow the same file organization and grouping of types.

## JSON Schema Support
Currently JSON Schema draft v4 is supported.  (http://json-schema.org/draft-04/schema#)

## XML Schema 1.0 Support Summary
All entities are supported.

## XML Schema 1.1 Support Summary
TBD

## XML Schema Support Details
[Xsd2JsonSchmea XML Schema Support Status](https://drive.google.com/open?id=1AMeTHNNvwuI06mjkAQi7mt8KmU7qUSFI7x-o_kF1Ko8)

## Documentation
TBD

## Developing
Please see the wiki for an overview of the code and outstanding development needs.  [Developing](https://github.com/andrewbober/xsd2jsonschema/wiki/Developing)

## Node & Npm version requirements
* Node - TBD
* Npm - Version 4+

## Third-Party Libraries used by this module:
* [xmldom](https://www.npmjs.com/package/xmldom) - A pure JavaScript library for xml parsing.
* [libxmljs](https://www.npmjs.com/package/libxmljs) (optional) - A native library for faster xml parsing.  This requires a C/C++ compiler to build and changes the programming model for customizations. (but it is over twice as fast)
* [urijs](https://www.npmjs.com/package/urijs) - 

## Third-Party Development Libraries used by this module:
* [require-self](https://www.npmjs.com/package/require-self) - This support library allows the example.js script and functional tests to utilize the library as intended.
* [Jasmine](https://github.com/jasmine/jasmine) - JavaScript Testing Framework
* [Istanbul](https://github.com/gotwarlost/istanbul) - JavaScript code coverage tool
* [node-coveralls](https://github.com/nickmerwin/node-coveralls) - Automated updates to [Coveralls.io](http://coveralls.io)
* [JSDoc](https://usejsdoce.org) - Javascript documentation generation library
* [jsdoc-oblivion](http://jsdoc-oblivion.moogs.io) - A template theme for [JSDoc](https://usejsdoce.org)
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

## License
Copyright (C) 2017 Andrew Bober <andy.bober@gmail.com>
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.