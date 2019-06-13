'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;

const XML_SCHEMA = 
`
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" targetNamespace="http://www.xsd2jsonschema.org/example" version="1.1.0" 
	xmlns="http://www.xsd2jsonschema.org/example" 
	xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xs:annotation>
		<xs:documentation>AnyOfChoice samples both valid and invalid.</xs:documentation>
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

describe('BaseSpecialCaseIdentifier Test', function () {
    describe('OptionalChoice', function () {
        var sci = new BaseSpecialCaseIdentifier();
        var optionalChoiceXsd;

        beforeEach(function () {
            sci = new BaseSpecialCaseIdentifier();
            optionalChoiceXsd = new XsdFile({ 
                uri: 'optionalChoice.xsd',
                xml: XML_SCHEMA
            });
        });

        afterEach(function () {

        });


        // **** isOptional() ****
        it('should identify a <choice> that as optional because it has the attribute \'minOccurs\' set to zero', function () {
            const nodes = optionalChoiceXsd.select('//xs:complexType[@name=\'optionalChoiceEverythingIsOptionalType\']/xs:sequence/xs:choice');
            nodes.forEach(function (node) {
                expect(sci.isOptional(node, optionalChoiceXsd)).toBeTruthy();
            });
        });

        it('should identify a <choice> that as optional because it has the attribute \'minOccurs\' set to zero', function () {
            const nodes = optionalChoiceXsd.select('//xs:complexType[@name=\'optionalChoiceAllOptionsRequiredType\']/xs:sequence/xs:choice');
            nodes.forEach(function (node) {
                expect(sci.isOptional(node, optionalChoiceXsd)).toBeTruthy();
            });
        });

    });
});
