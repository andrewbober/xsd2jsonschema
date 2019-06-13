
'use strict';

const URI = require('urijs');
const XsdFile = require('xsd2jsonschema').XsdFile;
const XsdNodeTypes = require('xsd2jsonschema').XsdNodeTypes;

describe('XsdFileXmlDomFile Test -', function() {
    var example;
    var base;
    var attr;

    beforeEach(function() {
        example = new XsdFile({ 
            uri: 'test/xmlSchemas/example/ExampleTypes.xsd',
            xml: this.readfile('test/xmlSchemas/example/ExampleTypes.xsd')
        });
        base = new XsdFile({ 
            uri: 'test/xmlSchemas/example/BaseTypes.xsd',
            xml: this.readfile('test/xmlSchemas/example/BaseTypes.xsd')
        });
        attr = new XsdFile({ 
            uri: 'test/xmlschemas/unit/attributes.xsd',
            xml: this.readfile('test/xmlschemas/unit/attributes.xsd')
        });
    });

    it('should return a fully constructed XsdFile instance', function() {
        expect(example).not.toBeUndefined();
        const uri = new URI('test/xmlSchemas/example/ExampleTypes.xsd');
        //uri.toString();
        //example.uri.toString();
        expect(example.uri).toEqual(uri);
    });

    it('should fail argument checks', function() {
        expect(function() {
            example = new XsdFile();
        }).toThrow(Error('Parameter "options" is required'));

        expect(function() {
            base = new XsdFile({});
        }).toThrow(Error('"options.uri" is required'));

        expect(function() {
            base = new XsdFile({
                uri: 'something'
            });
        }).toThrow(Error('"options.xml" is required'));
    });

    it('should setup the targetNamespace from the schema element attributes', function() {
        // The schema tag in this test needs to have a 'targetNamespace' attribute.
    })

    it('should setup the default namespace from the schema element attributes', function() {
        // The schema tag in this test needs to have an 'xmlns' attribute
        // The default namespace is generally specific to the schema but it could be the XML Schema Namespace
    })

    it('should setup any declared namespaces from the schema element attributes', function() {
        // The schema tag in this test needs to have one ore more namespaces declared.
        // This generally this includes the XML Schema Namespace
    })

    it('should return true if the xml schema has includes', function() {
        expect(example.hasIncludes()).toBeTruthy();
        expect(base.hasIncludes()).toBeFalsy();
    });

    it('should select the node', function() {
        const node = base.select1('//xs:pattern');
        expect(node).not.toBeUndefined();
    });

    it('should log an error to debug and throw the error', function() {
        expect(function() {
            base.select(function() {
                console.log('Andy');
            });
        }).toThrow(Error('Unexpected character {'));
    })

    it('should log an error to debug and throw the error', function() {
        expect(function() {
            base.select1('');
        }).toThrow(Error('XPath parse error'));
    })

    it('should return a string representation of the XsdFile', function() {
        const str = example.toString().replace(/\r/g, '');
        const expected =
`baseFilename=ExampleTypes.xsd
uri=test/xmlSchemas/example/ExampleTypes.xsd
includeUris=test/xmlSchemas/example/BaseTypes.xsd
namespaces={
	"xs": "http://www.w3.org/2001/XMLSchema",
	"": "http://www.xsd2jsonschema.org/example",
	"targetNamespace": "http://www.xsd2jsonschema.org/example"
}
xmlDoc=﻿<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://www.xsd2jsonschema.org/example" targetNamespace="http://www.xsd2jsonschema.org/example" elementFormDefault="qualified" attributeFormDefault="unqualified" version="1.0.0">
	<xs:include schemaLocation="test/xmlSchemas/example/BaseTypes.xsd"/>

	<xs:complexType name="PersonInfoType">
		<xs:sequence>
			<xs:element name="PersonName" type="PersonNameType"/>
			<xs:element name="Age" type="Integer" minOccurs="0"/>
			<xs:element name="BirthDate" type="Date"/>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="PersonNameType">
		<xs:sequence>
			<xs:element name="FirstName" type="Char_20"/>
			<xs:element name="MiddleName" type="Char_20" minOccurs="0"/>
			<xs:element name="LastName" type="Char_20"/>
			<xs:element name="AliasName" type="Char_20" minOccurs="0" maxOccurs="unbounded"/>
		</xs:sequence>
	</xs:complexType>
</xs:schema>`;
        expect(str).toEqual(expected);
    });

    it('should dump all attributes of an xml node and then dump the node', function() {
        const node = base.select1('//xs:schema');
        XsdFile.dumpAttrs(node);
        XsdFile.dumpNode(node);
    })

    // TODO: Document why this functoinality is needed.
    it('should not find a bogus attribute', function() {
        expect(XsdFile.hasAttribute({}, 'bogus')).toBeFalsy();
    })

    it('should return the value of the attribute named value', function() {
        const node = base.select1('//xs:minLength');
        expect(XsdFile.getValueAttr(node)).toEqual('1');
    })

    it('should return the value of the numeric attribute named value', function() {
        const node = base.select1('//xs:minLength');
        expect(XsdFile.getNumberValueAttr(node)).toEqual(1);
    })

    it('should throw and error if the value of the numeric attribute named value is not numeric', function() {
        const node = base.select1('//xs:pattern');
        expect(function() {
            XsdFile.getNumberValueAttr(node)
        }).toThrow(Error('Unable create a Number from [[\\p{IsBasicLatin}]*]'));
    });

    it('should return the type node given one of its constituent nodes', function() {
        const node = base.select1('//xs:pattern');
        const typeNode = XsdFile.getTypeNode(node);
        expect(typeNode).not.toBeUndefined();
        expect(XsdFile.getNodeName(typeNode)).toEqual('simpleType');
        //expect(typeNode)
    })

    it('should return the name of the node for all nodes included text and comment nodes', function() {
        var schemaNode = attr.select1('//xs:schema');
        var childNodes = XsdFile.getChildNodes(schemaNode);
        expect(XsdFile.getNodeName(childNodes[1])).toEqual('attribute');
        expect(XsdFile.getNodeName(childNodes[13])).toEqual('comment');
        expect(XsdFile.getNodeName(childNodes[14])).toEqual('text');
    })

    it('should return true if a node with a reference (ref) attribute is found', function() {
        const nodes = attr.select('//xs:attribute');
        expect(XsdFile.isReference(nodes[6])).toBeTruthy();
    })
});
