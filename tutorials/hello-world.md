## Hello World Example

A Hello World program is traditionally a program consiting of the minimal amount of code required to produce "Hello, World" on the screen.  In our case the Hello World program the minimal amount of code required to convert an XML Schema to JSON Schema.

Consider the file hello-world.js, which is shown below in its entirety, from the ./examples directory.  It does three basic steps:

1. Bring in the Xsd2JsonSchema library using require().  There are many classes within Xsd2JsonSchema.  In this case the only class needed is the namesake.
2. Allocate an instance of the Xsd2JsonSchema class.
3. Convert a schema using the processAllSchemas() method.

**Note:** As of Xsd2JsonSchema v0.3.0 the library +*/operates on strings.  Schema file loading and saving is left to the application.  In this example the XML schema is provided as a simple template literal.

```javascript
/**
 *  Basic Xsd2JsonSchema usage sample.
 */

'use strict';

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;

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

const xs2js = new Xsd2JsonSchema();

const convertedSchemas = xs2js.processAllSchemas( {
	schemas: {'hello_world.xsd': XML_SCHEMA}
});
const jsonSchema = convertedSchemas['hello_world.xsd'].getJsonSchema();
console.log(JSON.stringify(jsonSchema, null, 2));

```

To run this program from the command line please execute one of the folllowing commands from the project directory:

```
npm run hello-world

or 

node ./examples/hello-world.js

```

This will dump the converted JSON schema to stdout similar to what is shown below.

```
{
  "$id": "hello_world.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "This JSON Schema file was generated from hello_world.xsd on Sat Apr 27 2019 22:10:32 GMT-0500 (Central Daylight Time).  For more information please see http://www.xsd2jsonschema.org",
  "description": "Schema tag attributes: xmlns:xs='http://www.w3.org/2001/XMLSchema'",
  "type": "object",
  "anyOf": [
    {
      "required": [
        "C"
      ]
    },
    {
      "required": [
        "Char_20"
      ]
    }
  ],
  "properties": {
    "C": {
      "$ref": "#/definitions/C"
    },
    "Char_20": {
      "$ref": "#/definitions/Char_20"
    }
  },
  "definitions": {
    "C": {
      "type": "string",
      "minLength": 1
    },
    "Char_20": {
      "allOf": [
        {
          "$ref": "#/definitions/C"
        },
        {
          "minLength": 1,
          "maxLength": 20
        }
      ]
    }
  }
}

```