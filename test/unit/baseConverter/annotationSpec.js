'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFileDraft04 = require('xsd2jsonschema').JsonSchemaFileDraft04;
const ConverterDraft04 = require('xsd2jsonschema').ConverterDraft04;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const CONSTANTS = require('xsd2jsonschema').Constants;

const XML_SCHEMA = `
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

describe('BaseConverter Test <annotation>', function () {
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
			uri: 'annotation-test.xsd',
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

	it('should pull the text out of a the xml node (including child nodes) and confirm a newly allocated BaseConverter was properly initiialized', function () {
		const unknownNode = xsd.select1('//whyIsItUsed');
		const workingSchema = new JsonSchemaFileDraft04();
		spyOn(converter.parsingState, 'inDocumentation').and.returnValue(true);
		converter.workingJsonSchema = workingSchema;
		converter.text(unknownNode, jsonSchema, xsd);
		expect(converter.workingJsonSchema.description).toEqual('<whyIsItUsed> <usedBy>Used somewhere over a rainbow</usedBy> <usedFor>Used for the pot of gold</usedFor> </whyIsItUsed> <whenIsItUsed>Upon acquisition of the pot of gold</whenIsItUsed> Living on the edge outside a tag on the other side of the rainbow');
	});
});