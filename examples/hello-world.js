/**
 *  Basic Xsd2JsonSchema usage sample.
 */

'use strict';

const XML_SCHEMA = `
<?xml version="1.0" encoding="UTF-8"?>
<schema  xmlns="http://www.w3.org/2001/XMLSchema">
	<simpleType name="C">
		<restriction base="string">
			<minLength value="1"/>
		</restriction>
	</simpleType>
	<simpleType name="Char_20">
		<restriction base="C">
			<minLength value="1"/>
			<maxLength value="20"/>
		</restriction>
	</simpleType>
</schema>
`;

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const xs2js = new Xsd2JsonSchema();

const convertedSchemas = xs2js.processAllSchemas( {
	schemas: {'hello_world.xsd': XML_SCHEMA}
});
const jsonSchema = convertedSchemas['hello_world.xsd'].getJsonSchema();
console.log(JSON.stringify(jsonSchema, null, 2));
