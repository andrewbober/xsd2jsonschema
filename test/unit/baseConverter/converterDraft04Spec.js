'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFileDraft04 = require('xsd2jsonschema').JsonSchemaFileDraft04;
const ConverterDraft04 = require('xsd2jsonschema').ConverterDraft04;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const CONSTANTS = require('xsd2jsonschema').Constants;

const XML_SCHEMA =
	`
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" targetNamespace="http://www.xsd2jsonschema.org/example" version="1.1.0" 
	xmlns="http://www.xsd2jsonschema.org/example" 
	xmlns:example="http://www.xsd2jsonschema.org/example" 
	xmlns:xs="http://www.w3.org/2001/XMLSchema">
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
	<xs:complexType name="optionalChoiceEverythingIsOptionalType">
		<xs:sequence>
			<xs:element name="Option6" type="xs:string" minOccurs="0"/>
			<xs:element name="Option5" type="xs:string" minOccurs="0"/>
			<xs:element name="Option4" type="xs:string" minOccurs="0"/>
			<xs:element name="Option3" type="xs:string" minOccurs="0"/>
			<xs:choice minOccurs="0">
				<xs:element name="Option2" type="xs:string" minOccurs="0"/>
				<xs:element name="Option1" type="xs:string" minOccurs="0"/>
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="optionalChoiceAllOptionsRequiredType">
		<xs:sequence>
			<xs:element name="Option3" type="xs:boolean"/>
			<xs:choice minOccurs="0">
				<xs:element name="Option2" type="xs:string"/>
				<xs:element name="Option1" type="xs:string"/>
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="optionalChoiceOneRequiredOptionType">
		<xs:sequence>
			<xs:element name="Option2" type="xs:boolean"/>
			<xs:choice minOccurs="0">
				<xs:element name="Option1" type="xs:string"/>
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="optionalChoiceOneRequiredOptionAndOneOptionalType">
		<xs:sequence>
			<xs:element name="Option3" type="xs:boolean"/>
			<xs:choice minOccurs="0">
				<xs:element name="Option2" type="xs:string"/>
				<xs:element name="Option1" type="xs:string" minOccurs="0"/>
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="optionalChoiceTwoRequiredOptionAndOneOptionalType">
		<xs:sequence>
			<xs:element name="Option4" type="xs:boolean"/>
			<xs:choice minOccurs="0">
				<xs:element name="Option3" type="xs:string"/>
				<xs:element name="Option2" type="xs:string"/>
				<xs:element name="Option1" type="xs:string" minOccurs="0"/>
			</xs:choice>
		</xs:sequence>
	</xs:complexType>
</xs:schema>
`;

describe('BaseConverter Test -', function () {
	var converter;
	var xsd;
	var jsonSchema;

	beforeEach(function () {
		var namespaceManager = new NamespaceManager({
			jsonSchemaVersion: CONSTANTS.DRAFT_04,
			builtInTypeConverter: new BuiltInTypeConverter()
		});
		converter = new ConverterDraft04({
			namespaceManager: namespaceManager,
			specialCaseIdentifier: new BaseSpecialCaseIdentifier()
		});
		xsd = new XsdFile({
			uri: 'optionalChoice.xsd',
			xml: XML_SCHEMA
		});
		jsonSchema = new JsonSchemaFileDraft04({
			baseFilename: xsd.baseFilename,
			targetNamespace: xsd.targetNamespace,
			baseId: "http://www.xsd2jsonschema.org/unittests/"
		});
	});

	afterEach(function () {

	})

	it('should confirm a newly allocated BaseConverter was properly initiialized', function () {
		const blankNamespaces = {};
		blankNamespaces[CONSTANTS.XML_SCHEMA_NAMESPACE] = { types: {} }
		blankNamespaces[CONSTANTS.GLOBAL_ATTRIBUTES_SCHEMA_NAME] = { types: {} }

		expect(converter.builtInTypeConverter).not.toBeUndefined();
		expect(converter.specialCaseIdentifier).not.toBeUndefined();
		expect(converter.namespaceManager.namespaces).toEqual(blankNamespaces);
	});

	it('should skip processing xml tags that are outside the XML Schema specficication', function () {
		const unknownNode = xsd.select1('//example:whyIsItUsed');
		spyOn(converter, 'skippingUnknownNode').and.callThrough();
		converter.process(unknownNode, jsonSchema, xsd);
		expect(converter.skippingUnknownNode).toHaveBeenCalled();
	})

	it('should not skip processing xml tags that are defined by the XML Schema specficication', function () {
		const schemaNode = xsd.select1('//xs:schema');
		spyOn(converter, 'skippingUnknownNode').and.callThrough();
		converter.process(schemaNode, jsonSchema, xsd);
		expect(converter.skippingUnknownNode).not.toHaveBeenCalled();
    })
});
