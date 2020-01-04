

![Xsd2JsonSchema](static/400dpiLogoCropped.png)

###  A pure JavaScript library for translating complex XML Schemas into JSON Schemas.

[![Codeship Status for andrewbober/xsd2jsonschema](https://app.codeship.com/projects/ee9a49e0-46b3-0133-28c9-569fce9c4062/status?branch=master)](https://app.codeship.com/projects/104942)
[![Coverage Status](https://coveralls.io/repos/github/andrewbober/xsd2jsonschema/badge.svg?branch=master)](https://coveralls.io/github/andrewbober/xsd2jsonschema?branch=master)
[![GitHub version](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema.png)](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema)
[![npm version](https://badge.fury.io/js/xsd2jsonschema.svg)](https://badge.fury.io/js/xsd2jsonschema)

## Looking to convert schemas using a command line interface?

 If you want to convert XML Schemas into JSON Schemas without any coding please see the forthcoming companion command line interface [xsd2jsonschema-cli](https://www.npmjs.org/package/xsd2jsonschema-cli).

## Install

```
npm install xsd2jsonschema
```

## Quickstart
```javascript
const XML_SCHEMA = `
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema  xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xs:simpleType name="C">
		<xs:restriction base="xs:string">
			<xs:minLength value="1"/>
		</xs:restriction>
	</xs:simpleType>
	<xs:simpleType name="Char_20">
		<xs:restriction base="C">
			<xs:minLength value="1"/>
			<xs:maxLength value="20"/>
		</xs:restriction>
	</xs:simpleType>
</xs:schema>
`;

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const xs2js = new Xsd2JsonSchema();

const convertedSchemas = xs2js.processAllSchemas({
	schemas: {'hello_world.xsd': XML_SCHEMA}
});
const jsonSchema = convertedSchemas['hello_world.xsd'].getJsonSchema();
console.log(JSON.stringify(jsonSchema, null, 2));

```

## Features:
1. JSON Schema draft-04/06/07 are supported as of version 0.3.0.
2. Supports large mutli-file XML schemas with circular imports or includes, forward references, and any number of XML namespaces.
3. Preserves the original file organization in the resulting schema conversion.
4. Conversion logic has several configurable options and can be customized with your own code.
5. A companion command line interface is planned.  Please see [xsd2jsonschema-cli](https://www.npmjs.org/package/xsd2jsonschema-cli). 

## Documentation 
[Options](www.xsd2jsonschema.org/quickstartvideos)

[Videos](www.xsd2jsonschema.org/quickstartvideos)

[Referencehttps://www.xsd2jsonschema.org/documentation](https://www.xsd2jsonschema.org/documentation)

## Where to file issues 
[https://github.com/andrewbober/xsd2jsonschema/issues](https://github.com/andrewbober/xsd2jsonschema/issues)

## Developing
Please see the [Wiki](https://github.com/andrewbober/xsd2jsonschema/wiki/Developing) for an overview of the code and outstanding development needs.  

## Node & Npm version requirements
* Node - Version 6.11.0 LTS or higher
* Npm - Version 3.10.0 or higher

## Tools
* Created with [Visual Studio Code](https://github.com/Microsoft/vscode), [site](http://code.visualstudio.com)
* Continuous Integration by [Codeship](https://codeship.com)
* Test coverage history & statistics by [Coveralls.io](http://coveralls.io)

## References
1. [Definitive XML Schema, 2nd Edition](https://www.amazon.com/Definitive-XML-Schema-Priscilla-Walmsley/dp/0132886723), [site](https://www.pearsonhighered.com/program/Walmsley-Definitive-XML-Schema-2nd-Edition/PGM282380.html)
2. [XML Schema](https://www.w3.org/XML/Schema)
3. [JSON Schema](http://www.json-schema.org)
4. [XML Schema Test Suite](https://www.w3.org/XML/2004/xml-schema-test-suite) - The official World Wide Web Consortium (WC3) XML Schema Test Suite

## License
Copyright (C) 2019 Andrew Bober <andy.bober@gmail.com>
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
