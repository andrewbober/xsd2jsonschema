'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const XsdElements = require('xsd2jsonschema').XsdElements;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFileDraft04;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;

const XML_SCHEMA = 
`
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://www.xsd2jsonschema.org/tests" targetNamespace="http://www.xsd2jsonschema.org/tests" elementFormDefault="qualified" attributeFormDefault="unqualified" version="1.0.0">
	<xs:attribute name="globalAttrString" type="xs:string" />
	<xs:attribute name="globalAttrInteger" type="xs:integer" />
	<xs:attribute name="globalAttrBoolean" type="xs:boolean" />
	<xs:attribute name="globalAttrUntyped">
		<xs:simpleType>
			<xs:restriction base="xs:date"/>
		</xs:simpleType>
	</xs:attribute>
	<xs:complexType name="AttributeTestType">
			<xs:attribute name="localAttrInteger" type="xs:integer" />
			<xs:attribute name="localAttrRequired" type="xs:boolean" use="required" />
			<xs:attribute ref="globalAttrBoolean" />
			<xs:attribute ref="globalAttrUntyped" use="required" />
			<xs:attribute name="localAttribute">
				<xs:simpleType>
					<xs:restriction base="xs:integer" />
				</xs:simpleType>
			</xs:attribute>	
			<xs:attribute name="localAttrBoolean" type="xs:boolean" />
	</xs:complexType>
	<xs:element name="AttributeTest" type="AttributeTestType"/>
</xs:schema>
`;

describe('BaseSpecialCaseIdentifier Test -', function () {
    var sci;
    var xsd;
    var jsonSchema;
    
    beforeEach(function () {
        sci = new BaseSpecialCaseIdentifier();
        xsd = new XsdFile({ 
            uri: 'attributes.xsd',
            xml: XML_SCHEMA //.replace(/\n\t/gi, '')
        });
        jsonSchema = new JsonSchemaFile({
            xsd : xsd,
            baseId : "http://www.xsd2jsonschema.org/unit/test"
        });
    });

    afterEach(function () {

    })

    //addSpecialCase
    it('should add the given special case to the specialCases array', function() {
        sci.addSpecialCase({},{},{});
        expect(sci.specialCases.length).toEqual(1);
    })

    // isOptional
    it('should return true if something', function () {
        const node = xsd.select1('//xs:schema/xs:complexType');
        expect(sci.isOptional(null, xsd, 1)).toBeFalsy();
        expect(sci.isOptional(null, xsd, 0)).toBeTruthy();
        expect(sci.isOptional(node, xsd, undefined)).toBeFalsy();
        expect(sci.isOptional(node, xsd, null)).toBeFalsy();
    });

    // countNonTextNodes
    it('should return seven. There are six ELEMENT nodes in attributes.xsd', function () {
        expect(sci.countNonTextNodes(xsd.schemaElement.childNodes)).toEqual(6);
    });

    // locateNewNameType - zero nameTypes
    it('should return undefined because an empty array is passed in', function () {
        expect(sci.locateNewNameType({}, undefined)).toBeUndefined();
    });

    // generateAnyOfChoice - check args
    it('should return undefined because an empty JsonSchema is passed in', function () {
        expect(sci.generateAnyOfChoice(new JsonSchemaFile())).toBeUndefined();
    });

    // generateAnyOfChoice - check args
    it('should return undefined because an empty array is passed in', function () {
        sci.generateAnyOfChoice(new JsonSchemaFile());
    });

});