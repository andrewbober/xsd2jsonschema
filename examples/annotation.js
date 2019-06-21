'use strict';

const XML_SCHEMA_ANNOTATION = `
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" >
	<xs:simpleType name="XXXX">
		<xs:annotation>
			<xs:documentation>
				<whyIsItUsed>
            		<usedBy>Used somewhere over a rainbow</usedBy>
            	<usedFor>Used for the pot of gold</usedFor>
        		</whyIsItUsed>
        		<whenIsItUsed>Upon acquisition of the pot of gold</whenIsItUsed>
        		Living on the edge outside a tag on the other side of the rainbow
	    	</xs:documentation>
		</xs:annotation>
		<xs:restriction base="xs:token">
			<xs:pattern value=".{1,24}" />
		</xs:restriction>
	</xs:simpleType>
</xs:schema>
`;

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const xs2js = new Xsd2JsonSchema();

const convertedSchemas = xs2js.processAllSchemas({
	schemas: { 'annotation.xsd': XML_SCHEMA_ANNOTATION }
});
const jsonSchema = convertedSchemas['annotation.xsd'].getJsonSchema();
console.log(JSON.stringify(jsonSchema, null, 2));
