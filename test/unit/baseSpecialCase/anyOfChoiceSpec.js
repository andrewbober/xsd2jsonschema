'use strict';

const debug = require('debug')('xsd2jsonschema:BaseSpecialCaseIdentifier:AnyOfChoice')

const XsdFile = require('xsd2jsonschema').XsdFile;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFileDraft04;

const XML_SCHEMA = 
`
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" targetNamespace="http://www.xsd2jsonschema.org/example" version="1.1.0" 
	xmlns="http://www.xsd2jsonschema.org/example" 
	xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xs:annotation>
		<xs:documentation>AnyOfChoice samples both valid and invalid.</xs:documentation>
	</xs:annotation>
	<xs:complexType name="AnyOfChoiceValid1">
		<xs:sequence>
			<xs:choice>
				<xs:sequence>
					<xs:element name="Option2" type="xs:string"/>
					<xs:element name="Option1" type="xs:string" minOccurs="0"/>
				</xs:sequence>
				<xs:element name="Option1" type="xs:string"/>
			</xs:choice>
		</xs:sequence>
	</xs:complexType>

	<xs:complexType name="AnyOfChoiceValid2">
		<xs:sequence>
			<xs:choice>
				<xs:sequence>
					<xs:element name="Option3" type="xs:string" />
					<xs:element name="Option2" type="xs:string" minOccurs="0" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:sequence>
					<xs:element name="Option2" type="xs:string" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:element name="Option1" type="xs:string" />
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="AnyOfChoiceInvalidOptionsNotGroupedByAggregate">
		<xs:sequence>
			<xs:choice>
				<xs:element name="Option1" type="xs:string" />
				<xs:element name="Option2" type="xs:string" maxOccurs="unbounded" />
				<xs:element name="Option3" type="xs:string" maxOccurs="unbounded" />
				<xs:element name="Option4" type="xs:string" maxOccurs="unbounded" />
				<xs:element name="Option5" type="xs:string" />
				<xs:element name="Option6" type="xs:string" />
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="AnyOfChoiceInvalidOptionsAggregatesNotProgresive1">
		<xs:sequence>
			<xs:choice>
				<xs:sequence>
					<xs:element name="Option4" type="xs:string" />
					<xs:element name="Option3" type="xs:string" />
					<xs:element name="Option2" type="xs:string" minOccurs="0" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:sequence>
					<xs:element name="Option2" type="xs:string" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:element name="Option1" type="xs:string"/>
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="AnyOfChoiceInvalidOptionsAggregatesNotProgresive2">
		<xs:sequence>
			<xs:choice>
				<xs:sequence>
					<xs:element name="Option3" type="xs:string" />
					<xs:element name="Option2" type="xs:string" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:sequence>
					<xs:element name="Option2" type="xs:string" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:element name="Option1" type="xs:string" />
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="AnyOfChoiceInvalidOptionsAggregatesNotProgresive3">
		<xs:sequence>
			<xs:choice>
				<xs:sequence>
					<xs:element name="Option4" type="xs:string" />
					<xs:element name="Option3" type="xs:string" minOccurs="0" />
					<xs:element name="Option2" type="xs:string" minOccurs="0" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:sequence>
					<xs:element name="Option3" type="xs:string" />
					<xs:element name="Option2" type="xs:string" minOccurs="0" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:sequence>
					<xs:element name="Option2" type="xs:string" />
					<xs:element name="Option1" type="xs:string" minOccurs="0" />
				</xs:sequence>
				<xs:element name="Option1" type="xs:string" />
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
</xs:schema>
`;

describe('BaseSpecialCaseIdentifier AnyOfChoice Test', function () {
    describe('AnyOfChoice', function () {

        var sci = new BaseSpecialCaseIdentifier();
        var node;
        var anyOfChoiceXsd;

        beforeEach(function () {
            sci = new BaseSpecialCaseIdentifier();
            node = null;
            anyOfChoiceXsd = new XsdFile({ 
                uri: 'test/xmlSchemas/functional/anyOfChoice.xsd',
                xml: this.readfile('test/xmlSchemas/functional/anyOfChoice.xsd')
            });
        });

        afterEach(function () {

        });

        // **** isAnyOfChoice() ****
        it('should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[0];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).toBeTruthy();
        });

        it('should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[1];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).toBeTruthy();
        });

        it('should not identify a regular <choice> as a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[2];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).not.toBeTruthy();
        });

        it('should not identify a <choice> tag as an instance of the JSON Schema idium anyOf if the <choice> tag options don\'t allow it.  The choice options must increase in count by exactly one.', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[3];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).not.toBeTruthy();
        });

        it('should not identify a <choice> tag an instance of the JSON Schema idium anyOf if the <choice> tag options don\'t allow it.  The choice options must increase in count by exactly one and prior choices options must be optional.', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[4];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).not.toBeTruthy();
        });

        it('should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[5];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).toBeTruthy();
        });

        // generateAnyOfChoice - check args
        it('should identify a jsonSchmea instance that does not contain an AnyOfChoice', function() {
            const jsonSchema = new JsonSchemaFile();
            sci.generateAnyOfChoice(jsonSchema);
        })

        // generateAnyOfChoice
        it('should generate an AnyOfChoice in JsonSchema', function() {
            const jsonSchema = new JsonSchemaFile();
            const oneOfSchema = new JsonSchemaFile();
            oneOfSchema.setProperty('prop1', new JsonSchemaFile());
            oneOfSchema.setProperty('prop2', new JsonSchemaFile());
            oneOfSchema.setProperty('prop3', new JsonSchemaFile());
            jsonSchema.oneOf.push(oneOfSchema);
            sci.generateAnyOfChoice(jsonSchema);
            expect(jsonSchema.anyOf.length).toEqual(3);
            expect(jsonSchema.oneOf.length).toEqual(0);
        })

        // fixAnyOfChoice
        it('should identify an AnyOfChoice that is also a SiblingChoice and utilize the correct sq', function () {
            const jsonSchema = new JsonSchemaFile();
            const allOfJsonSchema = new JsonSchemaFile();
            sci.fixAnyOfChoice(jsonSchema);

            const oneOfSchema = new JsonSchemaFile();
            oneOfSchema.setProperty('prop1', new JsonSchemaFile());
            oneOfSchema.setProperty('prop2', new JsonSchemaFile());
            oneOfSchema.setProperty('prop3', new JsonSchemaFile());
            allOfJsonSchema.oneOf.push(oneOfSchema);
            allOfJsonSchema.isAnyOfChoice = true;
            jsonSchema.allOf.push(allOfJsonSchema);
            sci.fixAnyOfChoice(jsonSchema);
            expect(allOfJsonSchema.anyOf.length).toEqual(3);
            expect(allOfJsonSchema.oneOf.length).toEqual(0);            
        })

        // fixOptionalChoiceTruthy
        it('should generate an OptionalChoice using a True Schema (e.g. {})', function () {
            const jsonSchema = new JsonSchemaFile();
            const optionalChoice = jsonSchema.newJsonSchemaFile();
            const tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[2];

            expect(jsonSchema.description).toBeUndefined();
            expect(jsonSchema.anyOf.length).toBe(0);
            sci.fixOptionalChoiceTruthy(optionalChoice, node);
            
            // An truthy schema with only a description set should be added to the anyOf array.
            expect(jsonSchema.anyOf[0].description).toBe('This truthy schema is what makes an optional <choice> optional.');
            expect(jsonSchema.anyOf.length).toBe(1);
        })

        // fixOptionalChoiceNot
        it('should generate an OptionalChoice using the NOT solution', function () {
            // TBD
        })

        // fixOptionalChoicePropertyDependency
        it('should generate an OptionalChoice using the Property Dependency solution', function () {
            // TBD
        })

        // fixOptionalChoice
        it('should select the appropriate method to generate an OptionalChoice based on the options', function () {
            // TBD
        })
    })

});