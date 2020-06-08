'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFileDraft06 = require('xsd2jsonschema').JsonSchemaFileDraft06;
const ConverterDraft06 = require('xsd2jsonschema').ConverterDraft06;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const CONSTANTS = require('xsd2jsonschema').Constants;

const XML_SCHEMA_MIN_EXCLUSIVE =
`
<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
  targetNamespace="http://www.java2s.com" 
  xmlns="http://www.java2s.com"
  elementFormDefault="qualified">

  <xs:simpleType name="negativeInteger">
    <xs:annotation>
      <xs:documentation source="http://www.w3.org/TR/xmlschema-2/#negativeInteger" />
    </xs:annotation>
    <xs:restriction base="xs:nonPositiveInteger">
      <xs:minExclusive value="-1"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>
`;

const XML_SCHEMA_MAX_EXCLUSIVE =
`
<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
  targetNamespace="http://www.java2s.com" 
  xmlns="http://www.java2s.com"
  elementFormDefault="qualified">

  <xs:simpleType name="negativeInteger">
    <xs:annotation>
      <xs:documentation source="http://www.w3.org/TR/xmlschema-2/#negativeInteger" />
    </xs:annotation>
    <xs:restriction base="xs:nonPositiveInteger">
      <xs:maxExclusive value="-1"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>
`;

describe('BaseConverter Test -', function () {
	var converter;
	var xsdMin;
	var jsonSchemaMin;
	var xsdMax;
	var jsonSchemaMax;

	beforeEach(function () {
		var namespaceManager = new NamespaceManager({
			jsonSchemaVersion: CONSTANTS.DRAFT_06,
			builtInTypeConverter: new BuiltInTypeConverter()
		});
		converter = new ConverterDraft06({
			namespaceManager: namespaceManager,
			specialCaseIdentifier: new BaseSpecialCaseIdentifier()
		});
		xsdMin = new XsdFile({
			uri: 'minExclusive.xsd',
			xml: XML_SCHEMA_MIN_EXCLUSIVE
		});
		jsonSchemaMin = new JsonSchemaFileDraft06({
			baseFilename: xsdMin.baseFilename,
			targetNamespace: xsdMin.targetNamespace,
			baseId: "http://www.xsd2jsonschema.org/unittests/"
		});
		xsdMax = new XsdFile({
			uri: 'maxExclusive.xsd',
			xml: XML_SCHEMA_MAX_EXCLUSIVE
		});
		jsonSchemaMax = new JsonSchemaFileDraft06({
			baseFilename: xsdMax.baseFilename,
			targetNamespace: xsdMax.targetNamespace,
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

    it('should evaluate exclusiveMinimum as a number', function() {
		var node = xsdMin.select1('//xs:schema');
		converter.process(node, jsonSchemaMin, xsdMin);
        expect(jsonSchemaMin.exclusiveMinimum).toBeUndefined();
		node = xsdMin.select1('//xs:schema/xs:simpleType/xs:restriction/xs:minExclusive');
		converter.process(node, jsonSchemaMin, xsdMin);
		expect(jsonSchemaMin.exclusiveMinimum).toEqual(-1);
    })

	it('should evaluate exclusiveMaxnimum as a number', function() {
		var node = xsdMax.select1('//xs:schema');
		converter.process(node, jsonSchemaMax, xsdMax);
        expect(jsonSchemaMax.exclusiveMinimum).toBeUndefined();
		node = xsdMax.select1('//xs:schema/xs:simpleType/xs:restriction/xs:maxExclusive');
		converter.process(node, jsonSchemaMax, xsdMax);
		expect(jsonSchemaMax.exclusiveMaximum).toEqual(-1);
    })
});
