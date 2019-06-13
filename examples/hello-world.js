/**
 *  Basic Xsd2JsonSchema usage sample.
 */

'use strict';

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

const convertedSchemas = xs2js.processAllSchemas( {
	schemas: {'hello_world.xsd': XML_SCHEMA}
});
const jsonSchema = convertedSchemas['hello_world.xsd'].getJsonSchema();
console.log(JSON.stringify(jsonSchema, null, 2));
